"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const server_1 = require("../primus/server");
const game_state_1 = require("../core/game-state");
const redis_1 = require("../plugins/scaler/redis");
// these functions pertain to one person logging in and out
exports.AllPlayers = (playerName) => {
    const allPlayers = game_state_1.GameState.getInstance().getPlayersSimple();
    server_1.primus.emitToPlayers([playerName], { playerListOperation: 'set', data: allPlayers.concat(redis_1.GetRedisPlayers()) });
};
exports.PlayerLoginData = (playerName, data) => {
    server_1.primus.forEach((spark, next) => {
        if (!spark.authToken || spark.authToken.playerName === playerName)
            return next();
        spark.write({ playerListOperation: 'add', data: data });
        next();
    }, () => { });
};
exports.PlayerLogin = (playerName) => {
    const simplePlayerToAdd = game_state_1.GameState.getInstance().getPlayerNameSimple(playerName);
    exports.PlayerLoginData(playerName, simplePlayerToAdd);
    const player = game_state_1.GameState.getInstance().getPlayer(playerName);
    const simplePlayerId = player.userId;
    const simpleAddData = _.cloneDeep(simplePlayerToAdd);
    simpleAddData.userId = simplePlayerId;
    redis_1.PlayerLoginRedis(playerName, simpleAddData);
};
exports.PlayerLogoutData = (playerName) => {
    server_1.primus.forEach((spark, next) => {
        if (!spark.authToken || spark.authToken.playerName === playerName)
            return next();
        spark.write({ playerListOperation: 'del', data: playerName });
        next();
    }, () => { });
};
exports.PlayerLogout = (playerName) => {
    exports.PlayerLogoutData(playerName);
    redis_1.PlayerLogoutRedis(playerName);
};
// these are global updater functions
exports.SomePlayersPostMoveData = (groupedByMap) => {
    server_1.primus.forEach((spark, next) => {
        if (!spark.authToken)
            return next();
        const player = game_state_1.GameState.getInstance().getPlayer(spark.authToken.playerName);
        if (!player)
            return next();
        const filteredData = groupedByMap[player.map];
        if (!filteredData || !filteredData.length)
            return next();
        spark.write({ playerListOperation: 'updateMass', data: filteredData });
        next();
    }, () => { });
};
exports.SomePlayersPostMove = (updatedPlayers) => {
    if (process.env.IGNORE_OTHER_PLAYER_MOVES)
        return;
    const gameState = game_state_1.GameState.getInstance();
    const data = gameState.getSomePlayersSimple(updatedPlayers, ['x', 'y', 'map']);
    const groupedByMap = _.groupBy(data, 'map');
    exports.SomePlayersPostMoveData(groupedByMap);
    redis_1.SomePlayersPostMoveRedis(groupedByMap);
};
exports.PlayerUpdateAllData = (data) => {
    server_1.primus.forEach((spark, next) => {
        spark.write({ playerListOperation: 'update', data });
        next();
    }, () => { });
};
exports.PlayerUpdateAll = (playerId, keys) => {
    const data = game_state_1.GameState.getInstance().getPlayerNameSimple(playerId, keys, true);
    exports.PlayerUpdateAllData(data);
    redis_1.PlayerUpdateAllRedis(data);
};
