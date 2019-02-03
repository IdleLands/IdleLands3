"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const IRC = require("squelch-client");
const settings_1 = require("../../static/settings");
const logger_1 = require("../../shared/logger");
const redis_1 = require("../scaler/redis");
const isProd = process.env.NODE_ENV === 'production' && !process.env.EXT_CHAT;
const { server, nick, channel } = settings_1.SETTINGS.chatConfig.irc;
class ExternalChatMechanism {
    connect(primus, sendRoom) {
        if (!isProd)
            return;
        if (!primus) {
            logger_1.Logger.error('ExtChat:IRC', new Error('Primus failed to inject correctly!'));
            return;
        }
        logger_1.Logger.info('ExtChat:IRC', `Connecting to ${server}${channel} as ${nick}...`);
        this.client = new IRC({
            server,
            nick,
            channels: [channel],
            autoConnect: false
        });
        this.client.connect().then(() => {
            logger_1.Logger.info('ExtChat:IRC', 'Connected!');
            this.isConnected = true;
            this.client.on('msg', ({ from, to, msg }) => {
                if (to !== '##idlebot')
                    return;
                let protocol = 'irc';
                if (_.includes(from, '<web:') || _.includes(msg, '<web:'))
                    return;
                if (_.startsWith(msg, '<') && _.includes(from, 'discord')) {
                    protocol = 'discord';
                    from = msg.split('<')[1].split('>')[0].trim();
                    msg = msg.split('>')[1].trim();
                }
                const messageObject = {
                    text: msg,
                    playerName: `<${protocol}:${from}>`,
                    timestamp: Date.now(),
                    channel: 'General',
                    route: sendRoom,
                    event: 'plugin:chat:sendmessage'
                };
                redis_1.SendChatMessage(messageObject, true);
            });
        });
    }
    sendMessage(msgData) {
        if (!isProd || !this.isConnected)
            return;
        this.client.msg(channel, `<web:${msgData.playerName} [${msgData.guildTag || 'no guild'}] [${msgData.title || 'no title'}] [${msgData.ascensionLevel}~${msgData.level}]> ${msgData.text}`);
    }
}
exports.ExternalChatMechanism = ExternalChatMechanism;
