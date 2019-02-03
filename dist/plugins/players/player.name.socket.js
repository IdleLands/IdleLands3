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
exports.event = 'plugin:player:changename';
exports.description = 'Mod only. Change targets name to something else.';
exports.args = 'targetName, newName';
exports.socket = (socket) => {
    const changename = ({ targetName, newName }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        if (!playerName)
            return;
        const gameState = game_state_1.GameState.getInstance();
        const player = gameState.getPlayer(playerName);
        const target = gameState.getPlayer(targetName);
        if (!player || !player.isMod || !target || !newName || !newName.trim())
            return;
        logger_1.Logger.info('Socket:Player:NameChange', `${socket.playerName} (${socket.address.ip}) changing player name from ${targetName} to ${newName}.`);
        target.changeName(newName);
    });
    socket.on(exports.event, changename);
};
