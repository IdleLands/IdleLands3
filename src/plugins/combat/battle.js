
const isBattleDebug = process.env.BATTLE_DEBUG;
const isQuiet = process.env.QUIET;

import _ from 'lodash';

import { StringGenerator } from '../../shared/string-generator';

import { persistToDb } from './battle.db';

import Chance from 'chance';
const chance = new Chance();

const MAX_ROUND = 100;

export class Battle {
  constructor({ parties, introText }) {
    this.parties = parties;
    this.introText = introText;
    this.happenedAt = Date.now();
    this.name = this.generateName();
    this.setId();
    this.messageData = [];
    this.currentRound = 0;
  }

  generateName() {
    return StringGenerator.battle();
  }

  isPlayerAlive(player) {
    return player.hp > 0;
  }

  get allPlayers() {
    return _.flatten(_.map(this.parties, 'players'));
  }

  get shouldGoOn() {
    return this.currentRound < MAX_ROUND && _.every(this.parties, party => {
      return _.some(party.players, p => this.isPlayerAlive(p));
    });
  }

  _emitMessage(message, data = null) {
    if(isBattleDebug && !isQuiet) {
      console.log(message);
    }
    this.messageData.push({ message, data });
  }

  startBattle() {
    this.setupParties();
    this.startMessage();
    this.startTakingTurns();
  }

  startMessage() {
    this._emitMessage(this.introText);
  }

  _partyStats() {
    return _.map(this.parties, party => {
      return {
        name: party.name,
        players: _.map(party.players, p => {
          return { name: p.fullname, hp: _.clone(p._hp), mp: _.clone(p._mp), special: _.clone(p._special) };
        })
      };
    });
  }

  roundMessage() {
    if(isBattleDebug && !isQuiet) {
      _.each(this._partyStats(), party => {
        console.log(party.name);
        console.log(party.players);
      });
    }
    this._emitMessage(`Round ${this.currentRound} start.`, this._partyStats());
  }

  tryIncrement(p, stat, value = 1) {
    if(!p.$statistics) return;
    p.$statistics.incrementStat(stat, value);
  }

  _setupPlayer(player) {
    player.$battle = this;
    player._hp.toMaximum();
    player._mp.toMaximum();
    player.$profession.setupSpecial(player);

    this.tryIncrement(player, 'Combats');
  }

  setupParties() {
    _.each(this.allPlayers, p => {
      this._setupPlayer(p);
    });
  }

  calculateTurnOrder() {
    this.turnOrder = _.sortBy(this.allPlayers, p => -p.liveStats.agi);
  }

  startTakingTurns() {
    while(this.shouldGoOn) {
      this.doRound();
    }

    this.endBattle();
  }

  doRound() {
    if(!this.shouldGoOn) {
      this.endBattle();
      return;
    }

    this.currentRound++;

    this.roundMessage();

    this.calculateTurnOrder();

    _.each(this.turnOrder, p => this.takeTurn(p));
  }

  takeTurn(player) {
    if(!this.isPlayerAlive(player) || !this.shouldGoOn) return;
    const stunned = player.liveStats.isStunned;
    if(stunned) {
      this._emitMessage(stunned);
    } else {
      this.doAttack(player);
    }

    this.emitEvents(player, 'TakeTurn');

    const hpRegen = player.liveStats.hpregen;
    const mpRegen = player.liveStats.mpregen;

    player._hp.add(hpRegen);
    player._mp.add(mpRegen);

    if(hpRegen > 0 || mpRegen > 0) {
      this._emitMessage(`${player.fullname} regenerated ${hpRegen} hp and ${mpRegen} mp!`);
    }

    player.$effects.tick();
  }

  doAttack(player, forceSkill) {
    let spell = null;

    if(!forceSkill) {
      const validSpells = this.validAttacks(player);
      const spellChoice = chance.weighted(_.map(validSpells, 'name'), _.map(validSpells, s => s.bestTier(player).weight));
      spell = _.find(player.spells, { name: spellChoice });
    } else {
      spell = _.find(player.spells, { name: forceSkill });
    }

    const spellRef = new spell(player);
    spellRef.preCast();
  }

  validAttacks(player) {
    return _(player.spells)
      .filter(spell => spell.shouldCast(player))
      .filter(spell => {
        const tier = spell.bestTier(player);
        if(!tier) return false;
        if(_.isFunction(tier.cost) && !tier.cost(player)) return false;
        if(_.isNumber(tier.cost) && player[`_${spell.stat}`].lessThan(tier.cost)) return false;
        return true;
      })
      .value();
  }

  get winningTeam() {
    return _.filter(this.parties, party => _.some(party.players, p => this.isPlayerAlive(p)))[0];
  }

  get losers() {
    const winners = this.winningTeam.players;
    return _.filter(this.allPlayers, p => !_.includes(winners, p));
  }

  get winners() {
    return this.winningTeam.players;
  }

  isLoser(party) {
    return _.every(party.players, p => p.hp === 0);
  }

  endBattle() {
    this._emitMessage('Battle complete.', this._partyStats());
    this.endBattleBonuses();
    persistToDb(this);
    this.cleanUp();

    if(isBattleDebug && this.kill) {
      process.exit(0);
    }
  }

  emitEvents(target, event) {
    target.$profession.handleEvent(target, event, { battle: this });
  }

  endBattleBonuses() {
    if(this.currentRound >= MAX_ROUND) {
      this._emitMessage('No one wins! It was a tie! Give it up already, people!');
      this._isTie = true;
      return;
    }

    _.each(this.parties, party => {
      // no monster bonuses
      if(!party.leader.isPlayer) return;

      // if this team won
      if(this.winningTeam === party) {

        this._emitMessage(`${party.displayName} won!`);

        const compareLevel = _.sum(_.map(this.losers, 'level')) / this.losers.length;
        const level = party.level;
        const levelDiff = Math.max(-5, Math.min(5, compareLevel - level)) + 6;

        const goldGainedInParty = Math.round((compareLevel * 1560) / party.players.length);

        _.each(party.players, p => {
          this.tryIncrement(p, 'Combat.Win');
          let gainedXp = Math.round(p._xp.maximum * (levelDiff / 100));
          if(compareLevel < level - 5) gainedXp = 0;
          this._emitMessage(`${p.fullname} gained ${gainedXp}xp and ${goldGainedInParty}gold!`);
          p.gainXp(gainedXp);
          p.gainGold(goldGainedInParty);
        });

      } else {
        this._emitMessage(`${party.displayName} lost!`);

        _.each(party.players, p => {
          this.tryIncrement(p, 'Combat.Lose');

          const compareLevel = _.sum(_.map(this.winners, 'level')) / this.winners.length;
          const lostGold = Math.round(p.gold / 100);
          let lostXp = Math.round(p._xp.maximum / 20);

          if(compareLevel > party.level + 5) {
            lostXp = 0;
          }

          this._emitMessage(`${p.fullname} lost ${lostXp}xp and ${lostGold}gold!`);

          p.gainXp(-lostXp);
          p.gainGold(-lostGold);
        });
      }
    });
  }

  dealDamage(target, damage) {
    if(damage > 0) {
      damage = Math.max(0, damage - target.liveStats.damageReduction);
    }
    target._hp.sub(damage);
    return damage;
  }

  setId() {
    this._id = `${this.happenedAt}-${this.name.split(' ').join('_')}`;
  }

  saveObject() {
    return {
      _id: this._id,
      name: this.name,
      happenedAt: this.happenedAt,
      messageData: this.messageData,
      parties: _.map(this.parties, party => party.buildTransmitObject())
    };
  }

  cleanUp() {
    _.each(this.allPlayers, p => {
      p.$battle = null;
      p.$profession.resetSpecial(p);
      p.$effects.clear();

      if(p.isPet) {
        p.party.playerLeave(p);
      }
    });
  }
}