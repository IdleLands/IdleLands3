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
const logger_1 = require("../../shared/logger");
exports.event = 'plugin:premium:buyilpitem';
exports.description = 'Buy items with ILP.';
exports.args = 'item';
exports.socket = (socket, primus, respond) => {
    const buyilp = ({ itemName }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        if (!playerName)
            return;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player)
            return;
        logger_1.Logger.info('Socket:ILP:Buy', `${playerName} (${socket.address.ip}) buying ${itemName}.`);
        const item = _.find(player.$premium.buyable, { name: itemName });
        if (!item) {
            return respond({ type: 'error', title: 'ILP Buy Error', notify: 'That item does not exist.' });
        }
        const errMsg = player.$premium.cantBuy(player, item);
        if (errMsg) {
            return respond({ type: 'error', title: 'ILP Buy Error', notify: errMsg });
        }
        player.$premium.buy(player, item);
    });
    socket.on(exports.event, buyilp);
};
