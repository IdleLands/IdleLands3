"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const server_1 = require("../../primus/server");
const game_state_1 = require("../../core/game-state");
exports.sendMessage = (messageObject, fromExtChat = false) => {
    if (_.includes(messageObject.route, ':pm:')) {
        const users = messageObject.route.split(':')[2].split('|');
        server_1.primus.forEach((spark, next) => {
            if (!_.includes(users, spark.playerName))
                return next();
            spark.write(messageObject);
            next();
        }, () => { });
    }
    else {
        if (messageObject.route === 'chat:channel:General') {
            server_1.primus.forEach((spark, next) => {
                spark.write(messageObject);
                next();
            }, () => { });
        }
        else if (_.includes(messageObject.route, 'chat:channel:Guild')) {
            const guildName = messageObject.route.split(':')[3];
            _.each(game_state_1.GameState.getInstance().getPlayers(), player => {
                if (player.guildName !== guildName)
                    return;
                _.each(server_1.primus.players[player.name], spark => {
                    spark.write(messageObject);
                });
            });
        }
        if (messageObject.route === 'chat:channel:General' && server_1.primus.extChat && !fromExtChat) {
            server_1.primus.extChat.sendMessage(messageObject);
        }
    }
};
