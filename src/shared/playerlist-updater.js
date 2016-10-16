
import _ from 'lodash';

import { primus } from '../primus/server';
import { GameState } from '../core/game-state';

// these functions pertain to one person logging in and out
export const AllPlayers = (playerName) => {
  const allPlayers = GameState.getInstance().getPlayersSimple();
  primus.emitToPlayers([playerName], { playerListOperation: 'set', data: allPlayers });
};

export const PlayerLogin = (playerName) => {
  const simplePlayerToAdd = GameState.getInstance().getPlayerNameSimple(playerName);
  primus.forEach((spark, next) => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return next();
    spark.write({ playerListOperation: 'add', data: simplePlayerToAdd });
    next();
  }, () => {});
};

export const PlayerLogout = (playerName) => {
  primus.forEach((spark, next) => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return next();
    spark.write({ playerListOperation: 'del', data: playerName });
    next();
  }, () => {});
};

// these are global updater functions
export const AllPlayersPostMove = () => {
  const gameState = GameState.getInstance();
  const data = gameState.getPlayersSimple(['x', 'y', 'map']);
  primus.forEach((spark, next) => {
    if(!spark.authToken) return next();
    const player = gameState.getPlayer(spark.authToken.playerName);
    if(!player) return next();
    const filteredData = _.filter(data, pt => pt.map === player.map);
    spark.write({ playerListOperation: 'updateMass', data: filteredData });
    next();
  }, () => {});
};

export const SomePlayersPostMove = (updatedPlayers) => {
  if(process.env.IGNORE_OTHER_PLAYER_MOVES) return;
  const gameState = GameState.getInstance();
  const data = gameState.getSomePlayersSimple(updatedPlayers, ['x', 'y', 'map']);

  const groupedByMap = _.groupBy(data, 'map');

  primus.forEach((spark, next) => {
    if(!spark.authToken) return next();
    const player = gameState.getPlayer(spark.authToken.playerName);
    if(!player) return next();
    const filteredData = groupedByMap[player.map];
    if(!filteredData || !filteredData.length) return next();
    spark.write({ playerListOperation: 'updateMass', data: filteredData });
    next();
  }, () => {});
};

export const PlayerUpdateAll = (playerId, keys) => {
  const data = GameState.getInstance().getPlayerNameSimple(playerId, keys);
  primus.forEach((spark, next) => {
    spark.write({ playerListOperation: 'update', data });
    next();
  }, () => {});
};
