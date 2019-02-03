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
exports.event = 'plugin:guild:demote';
exports.description = 'Demote a member to member status.';
exports.args = 'memberName';
exports.socket = (socket, primus, respond) => {
    const request = ({ memberName }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        if (!playerName)
            return;
        const gameState = game_state_1.GameState.getInstance();
        const player = gameState.getPlayer(playerName);
        if (!player || !player.guild || player.guild.$noGuild)
            return;
        logger_1.Logger.info('Socket:Guild:Demote', `${playerName} (${socket.address.ip}) demoting ${memberName}.`);
        const message = gameState.guilds.demoteMember(player, memberName);
        if (message) {
            respond({ type: 'error', title: 'Guild Error', notify: message });
        }
    });
    socket.on(exports.event, request);
};
