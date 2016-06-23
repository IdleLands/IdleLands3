
import _ from 'lodash';

class GameStateInternal {
  constructor() {
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  delPlayer(playerName) {
    this.players = _.reject(this.players, player => player.name === playerName);
  }
}

export const GameState = new GameStateInternal();