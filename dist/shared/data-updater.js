"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataUpdater = (playerName, type, data) => {
    // Would initialise server with testing if imported on top.
    const primus = require('../primus/server').primus;
    primus.emitToPlayers([playerName], { data, update: type });
};
