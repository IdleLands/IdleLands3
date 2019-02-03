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
const commands_1 = require("./commands");
const logger_1 = require("../../shared/logger");
exports.event = 'plugin:gm:togglemod';
exports.description = 'Mod only. Toggle moderator status for the target.';
exports.args = 'targetName';
exports.socket = (socket) => {
    const togglemod = ({ targetName }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player || !player.isMod)
            return;
        logger_1.Logger.info('Socket:GM:ToggleMod', `${playerName} (${socket.address.ip}) toggling mod for ${targetName}.`);
        commands_1.GMCommands.toggleMod(targetName);
    });
    socket.on(exports.event, togglemod);
};
