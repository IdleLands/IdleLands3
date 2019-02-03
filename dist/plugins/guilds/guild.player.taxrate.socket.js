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
const game_state_1 = require("../../core/game-state");
const logger_1 = require("../../shared/logger");
exports.event = 'plugin:guild:player:tax';
exports.description = 'Update your personal tax rate.';
exports.args = 'newRate';
exports.socket = (socket) => {
    const request = ({ newRate }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        if (!playerName)
            return;
        const gameState = game_state_1.GameState.getInstance();
        const player = gameState.getPlayer(playerName);
        if (!player)
            return;
        logger_1.Logger.info('Socket:Guild:SelfTaxRate', `${playerName} (${socket.address.ip}) setting own tax rate to ${newRate}%.`);
        gameState.guilds.updatePersonalTaxRate(player, newRate);
    });
    socket.on(exports.event, request);
};
