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
const game_state_1 = require("../../core/game-state");
const commands_1 = require("./commands");
const logger_1 = require("../../shared/logger");
exports.event = 'plugin:gm:givegold';
exports.description = 'Mod only. Give gold to a particular player.';
exports.args = 'targetName, bonusGold';
exports.socket = (socket) => {
    const givegold = ({ targetName, bonusGold }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player || !player.isMod || !targetName)
            return;
        bonusGold = +bonusGold;
        if (_.isNaN(bonusGold))
            return;
        logger_1.Logger.info('Socket:GM:GiveItem', `${playerName} (${socket.address.ip}) giving ${bonusGold} gold to ${targetName}.`);
        commands_1.GMCommands.giveGold(targetName, bonusGold);
    });
    socket.on(exports.event, givegold);
};
