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
const settings_1 = require("../../static/settings");
// const GENERAL_ROUTE = 'chat:channel:General';
// const EVENTS_ROUTE  = 'chat:general:Global Events';
const CHAT_SPAM_DELAY = process.env.CHAT_SPAM_DELAY || 2000;
const MAX_SPAM_MESSAGES = process.env.MAX_SPAM_MESSAGES || 5;
const SPAM_IGNORE_LEVEL = process.env.SPAM_IGNORE_LEVEL || 25;
const sendmessage_1 = require("./sendmessage");
const redis_1 = require("../scaler/redis");
exports.event = 'plugin:chat:sendmessage';
exports.description = 'Send a chat message.';
exports.args = 'text, channel, route';
exports.socket = (socket) => {
    // always join the general chat channel
    // socket.join(GENERAL_ROUTE);
    // socket.join(EVENTS_ROUTE);
    const sendmessage = ({ text, channel, route }) => __awaiter(this, void 0, void 0, function* () {
        if (!socket.authToken)
            return;
        const { playerName } = socket.authToken;
        if (!playerName)
            return;
        const player = game_state_1.GameState.getInstance().getPlayer(playerName);
        if (!player || !player.isOnline || player.isMuted || player.isBanned)
            return;
        if (!player.lastSentMessage)
            player.lastSentMessage = Date.now();
        const timestamp = Date.now();
        if (!player.spamMessages || _.isNaN(player.spamMessages))
            player.spamMessages = 0;
        if (timestamp - player.lastSentMessage < CHAT_SPAM_DELAY)
            player.spamMessages++;
        else
            player.spamMessages = Math.max(player.spamMessages - 1, 0);
        if (player.spamMessages > MAX_SPAM_MESSAGES && player.level < SPAM_IGNORE_LEVEL) {
            player.isMuted = true;
            if (!player.autoMutes)
                player.autoMutes = 0;
            player.autoMutes++;
            player.spamMessages = 0;
        }
        player.lastSentMessage = Date.now();
        text = _.truncate(text, { length: settings_1.SETTINGS.chatMessageMaxLength, omission: ' [truncated]' }).trim();
        if (!text)
            return;
        const messageObject = {
            text,
            timestamp,
            channel,
            route,
            title: player.title,
            playerName: player.nameEdit ? player.nameEdit : player.name,
            realPlayerName: player.name,
            level: player.level,
            event: exports.event,
            ip: player.$currentIp,
            shard: player.$shard,
            ascensionLevel: player.ascensionLevel,
            isMod: player.isMod,
            guildTag: player.guild.tag
        };
        sendmessage_1.sendMessage(messageObject);
        redis_1.SendChatMessage(messageObject);
    });
    socket.on(exports.event, sendmessage);
};
