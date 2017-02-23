
import _ from 'lodash';

import { primus } from '../primus/server';
import { GameState } from '../core/game-state';

import { PlayerLoginRedis, PlayerLogoutRedis, PlayerUpdateAllRedis, GetRedisPlayers, SomePlayersPostMoveRedis } from '../plugins/scaler/redis';

// these functions pertain to one person logging in and out
export const AllPlayers = (playerName) => {
  const allPlayers = GameState.getInstance().getPlayersSimple();
  primus.emitToPlayers([playerName], { playerListOperation: 'set', data: allPlayers.concat(GetRedisPlayers()) });
};

export const PlayerLoginData = (playerName, data) => {
  primus.forEach((spark, next) => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return next();
    spark.write({ playerListOperation: 'add', data: data });
    next();
  }, () => {});
};

export const PlayerLogin = (playerName) => {
  const simplePlayerToAdd = GameState.getInstance().getPlayerNameSimple(playerName);
  PlayerLoginData(playerName, simplePlayerToAdd);

  const simplePlayerId = GameState.getInstance().getPlayer(playerName).userId;
  const simpleAddData = _.cloneDeep(simplePlayerToAdd);
  simpleAddData.userId = simplePlayerId;

  PlayerLoginRedis(playerName, simpleAddData);
};

export const PlayerLogoutData = (playerName) => {
  primus.forEach((spark, next) => {
    if(!spark.authToken || spark.authToken.playerName === playerName) return next();
    spark.write({ playerListOperation: 'del', data: playerName });
    next();
  }, () => {});
};

export const PlayerLogout = (playerName) => {
  PlayerLogoutData(playerName);
  PlayerLogoutRedis(playerName);
};

// these are global updater functions

export const SomePlayersPostMoveData = (groupedByMap) => {

  primus.forEach((spark, next) => {
    if(!spark.authToken) return next();
    const player = GameState.getInstance().getPlayer(spark.authToken.playerName);
    if(!player) return next();
    const filteredData = groupedByMap[player.map];
    if(!filteredData || !filteredData.length) return next();
    spark.write({ playerListOperation: 'updateMass', data: filteredData });
    next();
  }, () => {});
};

export const SomePlayersPostMove = (updatedPlayers) => {
  if(process.env.IGNORE_OTHER_PLAYER_MOVES) return;
  const gameState = GameState.getInstance();
  const data = gameState.getSomePlayersSimple(updatedPlayers, ['x', 'y', 'map']);
  const groupedByMap = _.groupBy(data, 'map');
  SomePlayersPostMoveData(groupedByMap);
  SomePlayersPostMoveRedis(groupedByMap);
};

export const PlayerUpdateAllData = (data) => {
  primus.forEach((spark, next) => {
    spark.write({ playerListOperation: 'update', data });
    next();
  }, () => {});
};

export const PlayerUpdateAll = (playerId, keys) => {
  const data = GameState.getInstance().getPlayerNameSimple(playerId, keys, true);
  PlayerUpdateAllData(data);
  PlayerUpdateAllRedis(data);
};
