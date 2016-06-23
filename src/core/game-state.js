
import _ from 'lodash';
import { World } from './world/world';
import { Logger } from '../shared/logger';

class GameStateInternal {
  constructor() {
    this.players = [];

    Logger.info('GameState', 'Creating world.');
    this.world = new World();
  }

  addPlayer(player) {
    this.players.push(player);
  }

  delPlayer(playerName) {
    this.players = _.reject(this.players, player => player.name === playerName);
  }
}

export const GameState = new GameStateInternal();