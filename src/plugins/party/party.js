
import _ from 'lodash';

import Chance from 'chance';
const chance = new Chance();

import { GameState } from '../../core/game-state';
import { StringGenerator } from '../../shared/string-generator';

import { emitter } from '../../plugins/players/_emitter';
import { PartyLeave } from '../events/events/PartyLeave';

import { MessageCategories } from '../../shared/adventure-log';
import { MessageParser } from '../../plugins/events/messagecreator';

export class Party {
  constructor({ leader }) {
    this.players = [];
    this.name = this.generateName();
    GameState.getInstance().parties[this.name] = this;

    this.playerJoin(leader);
  }

  get score() {
    return _.sum(_.map(this.players, 'itemScore')) / this.players.length;
  }

  get level() {
    return _.sum(_.map(this.players, 'level')) / this.players.length;
  }

  get displayName() {
    return this.players.length === 1 ? this.players[0].fullname : `${this.name} (${_.map(this.players, 'fullname').join(', ')})`;
  }

  generateName() {
    let name = null;
    do {
      name = StringGenerator.party();
    } while(GameState.getInstance().parties[name]);

    return name;
  }

  allowPlayerToLeaveParty(player) {
    PartyLeave.operateOn(player);
  }

  setPartySteps(player) {
    player.partySteps = chance.integer({ min: 50, max: 200 });
  }

  playerTakeStep(player) {
    if(!player.partySteps) this.setPartySteps(player);
    player.partySteps--;

    if(player.partySteps <= 0) {
      this.allowPlayerToLeaveParty(player);
    }
  }

  playerJoin(player) {
    this.players.push(player);
    player.$partyName = this.name;

    if(player.isPlayer) {
      player.$statistics.incrementStat('Character.Party.Join');

      player.partySteps = 0;
      if(this.players.length > 1) {
        this.teleportNear(player, this.players[this.players.length-2]);
      }

      if(this.players.length > 1) {
        GameState.getInstance().reAddPlayersInOrder(this.players);
      }
    }
  }

  playerLeave(player, disbanding = false) {

    if(!disbanding && !this.isMonsterParty && !player.$battle && player.isPlayer) {
      emitter.emit('player:event', {
        affected: [player],
        eventText: MessageParser.stringFormat('%player has left %partyName.', player, { partyName: this.name }),
        category: MessageCategories.PARTY
      });
    }

    let doDisband = false;
    if(!player.$battle && player.isPlayer && ((this.players.length <= 2 && !disbanding) || player === this.leader)) doDisband = true;

    this.players = _.without(this.players, player);
    player.$partyName = null;
    if(player.isPlayer) {
      player.$statistics.incrementStat('Character.Party.Leave');
    }
    player.choices = _.reject(player.choices, c => c.event === 'PartyLeave');

    if(doDisband && !disbanding) this.disband(player);
  }

  get leader() {
    return this.players[0];
  }

  getFollowTarget(player) {
    if(player === this.leader) return;
    return this.players[_.indexOf(this.players, player)-1];
  }

  teleportNear(me, target) {
    me.x = target.x;
    me.y = target.y;
    me.map = target.map;
  }

  buildTransmitObject() {
    return {
      name: this.name,
      isBattleParty: this.isBattleParty,
      players: _.map(this.players, p => {
        return {
          name: p.fullname,
          level: p.level,
          profession: p.professionName
        };
      })
    };
  }

  disband(player) {
    if(!this.isBattleParty && !this.isMonsterParty) {
      emitter.emit('player:event', {
        affected: this.players,
        eventText: MessageParser.stringFormat('%player has disbanded %partyName.', player || this.leader, { partyName: this.name }),
        category: MessageCategories.PARTY
      });
    }

    _.each(this.players, p => this.playerLeave(p, true));
    GameState.getInstance().parties[this.name] = null;
    delete GameState.getInstance().parties[this.name];
  }

}