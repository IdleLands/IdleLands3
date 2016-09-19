
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
    this.playerTimeouts = {};

    Logger.info('GameState', 'Creating world.');
    this.world = constitute(World);
  }

  _hasTimeout(playerName) {
    return this.playerTimeouts[playerName];
  }

  _setTimeout(playerName, timeoutId) {
    if (this.playerTimeouts[playerName]) {
      clearTimeout(this.playerTimeouts[playerName]);
    }
    this.playerTimeouts[playerName] = timeoutId;
  }

  _clearTimeout(playerName) {
    clearTimeout(this.playerTimeouts[playerName]);
    delete this.playerTimeouts[playerName];
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

  reAddPlayersInOrder(players) {
    this.players = _.reject(this.players, player => _.includes(_.map(players, 'name'), player.name));
    this.players.push(..._.filter(players, player => player.isPlayer));
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

      player.choices = _.reject(player.choices, c => c.event === 'Party' || c.event === 'PartyLeave');

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

    if(remPlayer.$battle) {
      remPlayer._hp.set(0);
    }

    if(remPlayer.$partyName) {
      remPlayer.party.playerLeave(remPlayer, true);
    }

    remPlayer.save();
  }

  getPlayers() {
    return this.players;
  }

  getPlayerNameSimple(playerName, keys) {
    return this.getPlayerSimple(this.retrievePlayer(playerName), keys);
  }

  getPlayerSimple(player, keys = UPDATE_KEYS, override = false) {
    if(!override) {
      keys.push('_id', 'nameEdit', 'isMuted', 'isPardoned', 'isMod', 'name', '$currentIp');
      keys = _.uniq(keys);
    }
    return _.pick(player, keys);
  }

  getPlayersSimple(keys, override) {
    return _.map(this.players, p => this.getPlayerSimple(p, keys, override));
  }

  getSomePlayersSimple(playerNames, keys) {
    return _.compact(_.map(this.players, p => playerNames[p.name] ? this.getPlayerSimple(p, keys) : null));
  }

  retrievePlayer(playerName) {
    const playerObject = _.find(this.players, { name: playerName });
    if(playerObject) return playerObject;

    return this.playerLoad.loadPlayer(playerName);
  }
}