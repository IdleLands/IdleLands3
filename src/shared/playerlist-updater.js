
import { primus } from '../../primus/server';
import { GameState } from '../core/game-state';

// these functions pertain to one person logging in and out
export const AllPlayers = (playerName) => {
  primus.room(playerName).write({ playerListOperation: 'set', data: new GameState().getPlayersSimple() });
};

export const PlayerLogin = (playerName) => {
  primus.forEach(spark => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return;
    spark.write({ playerListOperation: 'add', data: new GameState().getPlayerNameSimple(playerName) });
  });
};

export const PlayerLogout = (playerName) => {
  primus.forEach(spark => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return;
    spark.write({ playerListOperation: 'del', data: playerName });
  });
};

// these are global updater functions
export const AllPlayersPostMove = () => {
  const data = new GameState().getPlayersSimple(['x', 'y', 'map']);
  primus.forEach(spark => spark.write({ playerListOperation: 'updateMass', data }));
};

export const PlayerUpdateAll = (playerName, keys) => {
  const data = new GameState().getPlayerNameSimple(playerName, keys);
  primus.forEach(spark => spark.write({ playerListOperation: 'update', data }));
};
