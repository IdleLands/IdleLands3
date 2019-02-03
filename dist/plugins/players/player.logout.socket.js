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
const _emitter_1 = require("./_emitter");
const game_state_1 = require("../../core/game-state");
const logger_1 = require("../../shared/logger");
exports.event = 'plugin:player:logout';
exports.description = 'Log out of the game.';
exports.args = '';
exports.socket = (socket, primus) => {
    const logout = () => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        logger_1.Logger.info('Socket:Player:Logout', `${playerName} (${socket.address.ip}) logging out.`);
        const gameState = game_state_1.GameState.getInstance();
        const timeoutId = setTimeout(() => {
            if (!gameState._hasTimeout(playerName))
                return;
            gameState._clearTimeout(playerName);
            primus.delPlayer(playerName, socket);
            _emitter_1.emitter.emit('player:logout', { playerName });
        }, 15000);
        gameState._setTimeout(playerName, timeoutId);
    });
    socket.on('close', logout);
    socket.on('end', logout);
    socket.on(exports.event, logout);
};
