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
const battle_db_1 = require("./battle.db");
const logger_1 = require("../../shared/logger");
exports.event = 'plugin:combat:retrieve';
exports.description = 'Retrieve a battle from the database.';
exports.args = 'battleName, playerName';
exports.socket = (socket, primus, respond) => {
    const retrieve = ({ battleName }) => __awaiter(this, void 0, void 0, function* () {
        try {
            const battle = yield battle_db_1.retrieveFromDb(battleName);
            if (!battle)
                return;
            logger_1.Logger.info('Socket:Battle', `${socket.address.ip} requesting ${battleName}.`);
            respond({ data: battle, update: 'battle' });
        }
        catch (e) {
            respond({ data: { msg: 'This battle does not exist or has expired.' }, update: 'battle' });
        }
    });
    socket.on(exports.event, retrieve);
};
