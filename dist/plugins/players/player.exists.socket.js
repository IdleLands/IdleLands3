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
const player_db_1 = require("./player.db");
const logger_1 = require("../../shared/logger");
const di_wrapper_1 = require("../../shared/di-wrapper");
exports.event = 'plugin:player:exists';
exports.description = 'Unauthenticated. Check if a particular player exists for auto-login purposes.';
exports.args = 'userId';
exports.socket = (socket, primus, respond) => {
    const playerDb = di_wrapper_1.constitute(player_db_1.PlayerDb);
    if (!playerDb) {
        // Logger?
        throw new Error('$playerDb could not be resolved.');
    }
    const exists = ({ userId }) => __awaiter(this, void 0, void 0, function* () {
        logger_1.Logger.info('Socket:Player:Exists', `${socket.address.ip} checking if ${userId} exists.`);
        try {
            yield playerDb.getPlayer({ userId });
            respond({ exists: true });
        }
        catch (e) {
            respond({ exists: false });
        }
    });
    socket.on(exports.event, exists);
};
