
import _ from 'lodash';

import { World } from './world/world';
import { Logger } from '../shared/logger';
import { constitute } from '../shared/di-wrapper';
import { MESSAGES } from '../static/messages';

import { PlayerLoad } from '../plugins/players/player.load';

const UPDATE_KEYS = ['x', 'y', 'map', 'gender', 'professionName', 'level', 'name', 'title'];

let GameStateInstance = null;
export class GameState {
  constructor() {
    if(GameStateInstance) {
      throw new Error('Can only instantiate GameState once!');
    }

    this.players = [];
    this.playerLoad = constitute(PlayerLoad);

    this.parties = {};

    Logger.info('GameState', 'Creating world.');
    this.world = constitute(World);
  }

  getParty(partyName) {
    return this.parties[partyName];
  }

  getPlayer(playerName) {
    return _.find(this.players, { name: playerName });
  }

  static getInstance() {
    if(GameStateInstance) {
      return GameStateInstance;
    }
    GameStateInstance = new GameState();
    return GameStateInstance;
  }

  addPlayer(playerName) {
    return new Promise(async (resolve, reject) => {
      if(this.getPlayer(playerName)) return resolve(false);
      const player = await this.retrievePlayer(playerName);

      // double check because async takes time
      if(this.getPlayer(playerName)) return resolve(false);

      if(!player) {
        return reject({ msg: MESSAGES.NO_PLAYER });
      }

      this.players.push(player);
      resolve(player);
    });
  }

  delPlayer(playerName) {
    const remPlayer = _.find(this.players, { name: playerName });
    if(!remPlayer) return;
    this.players = _.without(this.players, remPlayer);

    remPlayer.isOnline = false;
    remPlayer.choices = _.reject(remPlayer.choices, c => c.event === 'Party' || c.event === 'PartyLeave');

    if(remPlayer.$partyName) {
      remPlayer.party.playerLeave(remPlayer);
    }

    remPlayer.save();
  }

  getPlayers() {
    return this.players;
  }

  getPlayerNameSimple(playerName, keys) {
    return this.getPlayerSimple(this.retrievePlayer(playerName), keys);
  }

  getPlayerSimple(player, keys = UPDATE_KEYS) {
    keys.push('_id', 'nameEdit', 'isMuted', 'isMod', 'name');
    keys = _.uniq(keys);
    return _.pick(player, keys);
  }

  getPlayersSimple(keys) {
    return _.map(this.players, p => this.getPlayerSimple(p, keys));
  }

  retrievePlayer(playerName) {
    const playerObject = _.find(this.players, { name: playerName });
    if(playerObject) return playerObject;

    return this.playerLoad.loadPlayer(playerName);
  }
}