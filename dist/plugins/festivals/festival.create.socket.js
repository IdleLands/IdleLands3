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
const commands_1 = require("../gm/commands");
const logger_1 = require("../../shared/logger");
const asset_loader_1 = require("../../shared/asset-loader");
exports.event = 'plugin:festival:create';
exports.description = 'Mod only. Create a festival.';
exports.args = 'targetFestivalString';
exports.socket = (socket, primus, respond) => {
    const createfestival = ({ targetFestivalString }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player || !player.isMod)
            return;
        const festival = asset_loader_1.JSONParser.parseFestivalString(targetFestivalString);
        if (!festival || !festival.hours || !festival.name) {
            return respond({ type: 'error', notify: 'Invalid festival.' });
        }
        logger_1.Logger.info('Socket:GM:CreateFestival', `${playerName} (${socket.address.ip}) creating festival "${targetFestivalString}".`);
        const bonuses = _.omit(festival, ['hours', 'name']);
        const realFestival = {
            hourDuration: festival.hours,
            bonuses,
            name: festival.name,
            message: `${player.fullname} has started the "${festival.name}" festival! It will last ${festival.hours} hours!`
        };
        commands_1.GMCommands.createFestival(realFestival);
    });
    socket.on(exports.event, createfestival);
};
