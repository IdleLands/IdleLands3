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
// import { Logger } from '../../shared/logger';
exports.event = 'plugin:player:request:achievements';
exports.description = 'Request achievement data. Generally used only when looking at achievements.';
exports.args = '';
exports.socket = (socket) => {
    const requestachievements = () => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        if (!playerName)
            return;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player)
            return;
        // Logger.info('Socket:Player:RequestAchievements', `${socket.playerName} (${socket.address.ip}) requesting achievements.`);
        player._updateAchievements();
    });
    socket.on(exports.event, requestachievements);
};
