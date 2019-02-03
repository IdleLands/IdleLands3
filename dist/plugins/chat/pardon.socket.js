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
const commands_1 = require("../gm/commands");
exports.event = 'plugin:chat:togglepardon';
exports.description = 'Mod only. Toggle pardoned status for a particular user.';
exports.args = 'targetName';
exports.socket = (socket) => {
    const togglepardon = ({ targetName }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        if (!playerName)
            return;
        const gameState = game_state_1.GameState.getInstance();
        const player = gameState.getPlayer(playerName);
        if (!player || !player.isMod)
            return;
        logger_1.Logger.info('Socket:Pardon', `${playerName} (${socket.address.ip}) pardoning ${targetName}.`);
        commands_1.GMCommands.pardon(playerName);
    });
    socket.on(exports.event, togglepardon);
};
