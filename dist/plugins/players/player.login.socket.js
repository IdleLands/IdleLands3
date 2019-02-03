"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const player_1 = require("./player");
const player_db_1 = require("./player.db");
const _emitter_1 = require("./_emitter");
const logger_1 = require("../../shared/logger");
const di_wrapper_1 = require("../../shared/di-wrapper");
const messages_1 = require("../../static/messages");
const game_state_1 = require("../../core/game-state");
const AUTH0_SECRET = process.env.AUTH0_SECRET;
const SERVER_ID = _.isNaN(+process.env.INSTANCE_NUMBER) ? 0 : +process.env.INSTANCE_NUMBER;
const redis_1 = require("../scaler/redis");
exports.event = 'plugin:player:login';
exports.description = 'Log in or register a new character. Login only requires userId.';
exports.args = 'name, gender, professionName, token, userId';
exports.socket = (socket, primus, respond) => {
    const login = ({ name, gender, professionName, token, userId }) => __awaiter(this, void 0, void 0, function* () {
        if (_.isUndefined(process.env.INSTANCE_NUMBER)) {
            logger_1.Logger.info('Socket:Player:Login', 'No instance number, killing login.');
            socket.end(undefined, { reconnect: true });
            return;
        }
        let player = null;
        let event = '';
        const playerDb = di_wrapper_1.constitute(player_db_1.PlayerDb);
        logger_1.Logger.info('Socket:Player:Login', `Attempted login from (${socket.address.ip}, ${userId}).`);
        if (!playerDb) {
            logger_1.Logger.error('Login', new Error('playerDb could not be resolved.'));
            return respond({ msg: messages_1.MESSAGES.GENERIC });
        }
        const validateToken = (process.env.NODE_ENV === 'production' && !process.env.ALLOW_LOCAL) || !_.includes(userId, 'local|');
        if (validateToken) {
            if (AUTH0_SECRET) {
                try {
                    jwt.verify(token, new Buffer(AUTH0_SECRET, 'base64'), { algorithms: ['HS256'] });
                }
                catch (e) {
                    // Logger.error('Login', e, { token });
                    return respond(messages_1.MESSAGES.INVALID_TOKEN);
                }
            }
            else {
                logger_1.Logger.error('Login', new Error('Token needs to be validated, but no AUTH0_TOKEN is present.'));
            }
        }
        const gameState = game_state_1.GameState.getInstance();
        const oldPlayer = _.find(gameState.players, { userId });
        if (!oldPlayer) {
            try {
                player = yield playerDb.getPlayer({ userId });
                event = 'player:login';
            }
            catch (e) {
                // 20 char name is reasonable
                name = _.truncate(name, { length: 20 }).trim().replace(/[^\w\dÀ-ÿ ]/gm, '');
                name = name.split(' the ').join('');
                name = name.trim();
                if (name.length === 0) {
                    return respond(messages_1.MESSAGES.INVALID_NAME);
                }
                // sensible defaults
                if (!_.includes(['male', 'female'], gender))
                    gender = 'male';
                if (!_.includes(['Generalist', 'Mage', 'Cleric', 'Fighter'], professionName))
                    professionName = 'Generalist';
                let playerObject = {};
                try {
                    playerObject = di_wrapper_1.constitute(player_1.Player);
                }
                catch (e) {
                    logger_1.Logger.error('Login', e);
                    return respond(messages_1.MESSAGES.GENERIC);
                }
                playerObject.init({ _id: name, name, gender, professionName, userId }, false);
                try {
                    yield playerDb.createPlayer(playerObject.buildSaveObject());
                }
                catch (e) {
                    return respond(messages_1.MESSAGES.PLAYER_EXISTS);
                }
                try {
                    player = yield playerDb.getPlayer({ userId, name });
                }
                catch (e) {
                    logger_1.Logger.error('Login', e);
                    respond(messages_1.MESSAGES.GENERIC);
                }
                event = 'player:register';
            }
            if (player.isBanned) {
                const msg = _.clone(messages_1.MESSAGES.BANNED);
                msg.alreadyLoggedIn = true;
                respond(msg);
                socket.end();
                return;
            }
        }
        else {
            if (gameState._hasTimeout(oldPlayer.name)) {
                gameState._clearTimeout(oldPlayer.name);
            }
            logger_1.Logger.info('Login', `${oldPlayer.name} semi-login (server ${SERVER_ID}).`);
            event = 'player:semilogin';
        }
        const loggedInPlayerName = (oldPlayer || player).name;
        try {
            socket.authToken = { playerName: loggedInPlayerName, token };
            socket.playerName = loggedInPlayerName;
        }
        catch (e) {
            logger_1.Logger.error('login.socket.auth/name', e);
            return respond(messages_1.MESSAGES.GENERIC);
        }
        // closed
        if (socket.readyState === 2)
            return;
        logger_1.Logger.info('Socket:Player:Login', `${socket.playerName} (${socket.address.ip}, ${userId}) logging in (server ${SERVER_ID}).`);
        primus.addPlayer(loggedInPlayerName, socket);
        _emitter_1.emitter.emit(event, { playerName: loggedInPlayerName, fromIp: socket.address.ip });
        redis_1.PlayerForceLogout(loggedInPlayerName);
        const msg = _.clone(messages_1.MESSAGES.LOGIN_SUCCESS);
        msg.ok = true;
        return respond(msg);
    });
    socket.on(exports.event, login);
};
