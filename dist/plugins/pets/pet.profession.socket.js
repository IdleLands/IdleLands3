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
exports.event = 'plugin:pet:profession';
exports.description = 'Change your pets profession.';
exports.args = 'newProfession';
exports.socket = (socket, primus, respond) => {
    const petclass = ({ newProfession }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        if (!playerName)
            return;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player)
            return;
        logger_1.Logger.info('Socket:Pet:Profession', `${playerName} (${socket.address.ip}) pet profession change to ${newProfession}.`);
        const res = player.$pets.changePetProfession(player, newProfession);
        if (res) {
            respond({ type: 'error', title: 'Pet Error', notify: res });
        }
    });
    socket.on(exports.event, petclass);
};
