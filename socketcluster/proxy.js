
import { emitter as PlayerEmitter } from '../src/plugins/players/_emitter';
import { GameState } from '../src/core/game-state';

const playerToWorker = {};
const emitters = {
  player: PlayerEmitter
};

export class SocketProxy {
  static socketCluster = null;

  static setSocketCluster(socketCluster) {
    this.socketCluster = socketCluster;

    socketCluster.on('workerMessage', (id, data) => {
      const { event, playerName, emittedData = {} } = data;
      emittedData.playerName = playerName;

      if(event === 'player:login' || event === 'player:register') playerToWorker[playerName] = id;

      const emitter = event.split(':')[0];
      emitters[emitter].emit(event, emittedData);

      if(event === 'player:logout')                               playerToWorker[playerName] = null;
    });
  }

  static getWorkerForPlayer(playerName) {
    console.log(this.socketCluster);
    return this.socketCluster.workers[playerToWorker[playerName]];
  }

  static proxyMessageToWorker() {
    console.log(this.socketCluster);
  }
}
