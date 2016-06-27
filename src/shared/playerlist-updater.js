
import { primus } from '../../primus/server';
import { GameState } from '../core/game-state';

export const AllPlayers = (playerName) => {
  primus.room(playerName).write({ playerListOperation: 'set', data: GameState.getPlayersSimple() });
};

export const PlayerLogin = (playerName) => {
  primus.forEach(spark => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return;
    spark.write({ playerListOperation: 'add', data: GameState.getPlayerNameSimple(playerName) });
  });
};

export const PlayerLogout = (playerName) => {
  primus.forEach(spark => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return;
    spark.write({ playerListOperation: 'del', data: playerName });
  });
};

export const PlayerUpdate = (playerName, keys) => {
  primus.room(playerName).write({ playerListOperation: 'update', data: GameState.getPlayerNameSimple(playerName, keys) });
};