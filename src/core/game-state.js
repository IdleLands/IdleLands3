
import _ from 'lodash';
import { World } from './world/world';
import { Logger } from '../shared/logger';

// TODO store player hash in broker for maximum webscale
class GameStateInternal {
  constructor() {
    this.players = [];

    Logger.info('GameState', 'Creating world.');
    this.world = new World();
  }

  addPlayer(player) {
    if(_.find(this.players, { name: player.name })) return false;
    this.players.push(player);
    return true;
  }

  delPlayer(playerName) {
    this.players = _.reject(this.players, player => player.name === playerName);
  }

  getPlayers() {
    return this.players;
  }
}

export const GameState = new GameStateInternal();