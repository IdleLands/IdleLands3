
import _ from 'lodash';

import { primus } from '../../primus/server';
import { GameState } from '../core/game-state';

// these functions pertain to one person logging in and out
export const AllPlayers = (playerName) => {
  primus.forEach(spark => {
    if(!spark.authToken || spark.authToken.playerName !== playerName) return;
    spark.write({ playerListOperation: 'set', data: GameState.getInstance().getPlayersSimple() });
  });
};

export const PlayerLogin = (playerName) => {
  primus.forEach(spark => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return;
    spark.write({ playerListOperation: 'add', data: GameState.getInstance().getPlayerNameSimple(playerName) });
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
  const gameState = GameState.getInstance();
  const data = gameState.getPlayersSimple(['x', 'y', 'map']);
  primus.forEach(spark => {
    if(!spark.authToken) return;
    const player = gameState.getPlayer(spark.authToken.playerName);
    if(!player) return;
    const filteredData = _.filter(data, pt => pt.map === player.map);
    spark.write({ playerListOperation: 'updateMass', data: filteredData });
  });
};

export const PlayerUpdateAll = (playerId, keys) => {
  const data = GameState.getInstance().getPlayerNameSimple(playerId, keys);
  primus.forEach(spark => spark.write({ playerListOperation: 'update', data }));
};
