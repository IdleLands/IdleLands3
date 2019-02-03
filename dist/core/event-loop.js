"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const logger_1 = require("../shared/logger");
const game_state_1 = require("./game-state");
const settings_1 = require("../static/settings");
const playerlist_updater_1 = require("../shared/playerlist-updater");
logger_1.Logger.info('Core', 'Starting emitters.');
require("./emitter-watchers");
logger_1.Logger.info('Core', 'Loading assets.');
require("../shared/asset-loader");
logger_1.Logger.info('Core', 'Loading events.');
require("../plugins/events/eventhandler");
logger_1.Logger.info('Redis', 'Connecting to Redis (if possible).');
require("../plugins/scaler/redis");
logger_1.Logger.info('Core', 'Creating game state.');
game_state_1.GameState.getInstance();
logger_1.Logger.info('Core', 'Starting event loop.');
const timerDelay = settings_1.SETTINGS.timeframeSeconds * (process.env.NODE_ENV === 'production' ? 200 : 10);
const flagNextTurn = (player) => {
    player.$nextTurn = Date.now() + ((process.env.NODE_ENV === 'production' ? 1000 : 10) * settings_1.SETTINGS.timeframeSeconds);
};
const canTakeTurn = (now, player) => {
    return player.$nextTurn - now <= 0;
};
const playerInterval = () => {
    logger_1.Logger.silly('EventLoop:PlayerInterval', `Server: ${process.env.INSTANCE_NUMBER}`);
    const gameState = game_state_1.GameState.getInstance();
    const players = gameState.getPlayers();
    const now = Date.now();
    const ranPlayerNames = {};
    const playerTakeTurn = (player) => {
        if (!player.$nextTurn)
            flagNextTurn(player);
        if (!canTakeTurn(now, player))
            return;
        ranPlayerNames[player.name] = true;
        flagNextTurn(player);
        player.takeTurn();
    };
    _.each(players, playerTakeTurn);
    playerlist_updater_1.SomePlayersPostMove(ranPlayerNames);
};
const runPlayerInterval = () => {
    playerInterval();
    setTimeout(() => {
        process.nextTick(runPlayerInterval);
    }, timerDelay);
};
runPlayerInterval();
if (global.gc) {
    logger_1.Logger.info('Core', 'Running GC every 30 seconds.');
    setInterval(global.gc, 30000);
}
