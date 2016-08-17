
import _ from 'lodash';

import { StringGenerator } from '../../shared/string-generator';

import { persistToDb } from './battle.db';

export class Battle {
  constructor({ parties, introText }) {
    this.parties = parties;
    this.introText = introText;
    this.name = this.generateName();
    this.messageData = [];
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
    return _.every(this.parties, party => {
      return _.some(party.players, p => this.isPlayerAlive(p));
    });
  }

  _emitMessage(message, data = null) {
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
    this._emitMessage('Round start.', this._partyStats());
  }

  tryIncrement(p, stat, value = 1) {
    if(!p.$statistics) return;
    p.$statistics.incrementStat(stat, value);
  }

  setupParties() {
    _.each(this.allPlayers, p => {
      p.$battle = this;
      p._hp.toMaximum();
      p._mp.toMaximum();
      this.tryIncrement(p, 'Combats');
    });
  }

  calculateTurnOrder() {
    this.turnOrder = _.sortBy(this.allPlayers, p => p.liveStats.agi);
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

    this.roundMessage();

    this.calculateTurnOrder();

    _.each(this.turnOrder, p => this.takeTurn(p));
  }

  takeTurn(player) {
    if(!this.isPlayerAlive(player) || !this.shouldGoOn) return;
    this.doPhysicalAttack(player);
  }

  doPhysicalAttack(player) {
    const attackSpell = _.find(player.spells, spell => spell.name === 'Attack');
    const attackRef = new attackSpell(player);
    attackRef.preCast();
    attackRef.cast();
  }

  validMagicalAttacks(player) {
    // TODO: tiers, mp cost
    return _.filter(player.spells, spell => spell.name !== 'Attack');
  }

  doMagicalAttack(player) {
    const nonAttackSpell = _.sample(this.validMagicalAttacks(player));
    const attackRef = new nonAttackSpell(player);
    attackRef.preCast();
    attackRef.cast();
  }

  get winningTeam() {
    return _.filter(this.parties, party => _.some(party.players, p => this.isPlayerAlive(p)))[0];
  }

  get losers() {
    const winners = this.winningTeam.players;
    return _.filter(this.allPlayers, p => !_.includes(winners, p));
  }

  endBattle() {
    this._emitMessage('Battle complete.', this._partyStats());
    this.endBattleBonuses();
    persistToDb(this);
    this.cleanUp();
  }

  endBattleBonuses() {
    _.each(this.parties, party => {
      // no monster bonuses
      if(!party.leader.isPlayer) return;

      // if this team won
      if(this.winningTeam === party) {

        this._emitMessage(`${party.displayName} won!`);

        const level = party.level;
        const compareLevel = _.sum(_.map(this.losers, 'level')) / this.losers.length;
        const levelDiff = Math.max(-5, Math.min(5, level - compareLevel)) + 6;

        const goldGainedInParty = Math.round((compareLevel * 230) / party.players.length);

        _.each(party.players, p => {
          this.tryIncrement(p, 'Combat.Win');
          const gainedXp = Math.round(p._xp.maximum * (levelDiff / 100));
          this._emitMessage(`${p.fullname} gained ${gainedXp}xp and ${goldGainedInParty}gold!`);
          p.gainXp(gainedXp);
          p.gainGold(goldGainedInParty);
        });

      } else {
        this._emitMessage(`${party.displayName} lost!`);

        _.each(party.players, p => {
          this.tryIncrement(p, 'Combat.Lose');
          const lostGold = Math.round(p.gold / 100);
          const lostXp = Math.round(p._xp.maximum / 20);
          this._emitMessage(`${p.fullname} lost ${lostXp}xp and ${lostGold}gold!`);

          p.gainXp(-lostXp);
          p.gainGold(-lostGold);
        });
      }
    });
  }

  saveObject() {
    return {
      name: this.name,
      happenedAt: Date.now(),
      messageData: this.messageData,
      parties: _.map(this.parties, party => party.buildTransmitObject())
    };
  }

  cleanUp() {
    _.each(this.allPlayers, p => {
      p.$battle = null;
    });
  }
}