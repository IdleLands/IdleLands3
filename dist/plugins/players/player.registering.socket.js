"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../shared/logger");
exports.event = 'plugin:player:imregisteringrightnowdontkillme';
exports.args = '';
exports.description = 'Send this to the server to not have your socket killed while registering.';
exports.socket = (socket) => {
    const registering = () => {
        socket._registering = true;
        logger_1.Logger.info('Socket:Player:Registering', `${socket.address.ip} flagged as registering.`);
    };
    socket.on(exports.event, registering);
};
