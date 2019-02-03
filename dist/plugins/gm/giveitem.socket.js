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
const asset_loader_1 = require("../../shared/asset-loader");
const equipment_1 = require("../../core/base/equipment");
exports.event = 'plugin:gm:giveitem';
exports.description = 'Mod only. Give a custom item to a particular player.';
exports.args = 'targetName, targetItemString';
exports.socket = (socket, primus, respond) => {
    const giveitem = ({ targetName, targetItemString }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player || !player.isMod)
            return;
        const item = asset_loader_1.JSONParser.parseItemString(targetItemString);
        if (!item || !item.type || !item.name || !targetName) {
            return respond({ type: 'error', notify: 'Invalid item.' });
        }
        logger_1.Logger.info('Socket:GM:GiveItem', `${playerName} (${socket.address.ip}) giving item "${targetItemString}" to ${targetName}.`);
        const itemInst = new equipment_1.Equipment(item);
        commands_1.GMCommands.giveItem(targetName, itemInst);
    });
    socket.on(exports.event, giveitem);
};
