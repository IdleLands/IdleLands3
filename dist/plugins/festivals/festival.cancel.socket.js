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
const commands_1 = require("../gm/commands");
const logger_1 = require("../../shared/logger");
exports.event = 'plugin:festival:cancel';
exports.description = 'Mod only. Cancel a festival.';
exports.args = 'festivalId';
exports.socket = (socket, primus, respond) => {
    const cancelfestival = ({ festivalId }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player || !player.isMod)
            return;
        if (!festivalId) {
            return respond({ type: 'error', notify: 'Invalid festival.' });
        }
        logger_1.Logger.info('Socket:GM:CancelFestival', `${playerName} (${socket.address.ip}) cancelling festival "${festivalId}".`);
        commands_1.GMCommands.cancelFestival(festivalId);
        player.update();
    });
    socket.on(exports.event, cancelfestival);
};
