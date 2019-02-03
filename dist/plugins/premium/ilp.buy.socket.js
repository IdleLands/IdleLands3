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
exports.event = 'plugin:premium:buyilp';
exports.description = 'Buy ILP with gold.';
exports.args = 'ilpBuy';
exports.socket = (socket, primus, respond) => {
    const buyilp = ({ ilpBuy }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        if (!playerName)
            return;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player)
            return;
        logger_1.Logger.info('Socket:ILP:Buy', `${playerName} (${socket.address.ip}) buying ${ilpBuy} ILP.`);
        ilpBuy = +ilpBuy;
        if (!player.$premium.canBuyIlp(player, ilpBuy)) {
            return respond({ type: 'error', title: 'Buy ILP Error', notify: 'You do not have enough gold for that.' });
        }
        player.$premium.buyIlp(player, ilpBuy);
    });
    socket.on(exports.event, buyilp);
};
