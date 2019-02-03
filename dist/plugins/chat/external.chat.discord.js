"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Discord = require("discord.js");
const logger_1 = require("../../shared/logger");
const redis_1 = require("../scaler/redis");
const isProd = process.env.NODE_ENV === 'production' && !+process.env.EXT_CHAT;
class ExternalChatMechanism {
    connect(primus, sendRoom) {
        if (!isProd)
            return;
        if (!primus) {
            logger_1.Logger.error('ExtChat:Discord', new Error('Primus failed to inject correctly!'));
            return;
        }
        logger_1.Logger.info('ExtChat:Discord', `Connecting...`);
        this.client = new Discord.Client();
        this.client.login(process.env.DISCORD_TOKEN).then(() => {
            logger_1.Logger.info('ExtChat:Discord', `Connected!`);
            this.channel = this.client.channels.get(process.env.DISCORD_CHANNEL_ID);
        }).catch(e => {
            logger_1.Logger.error('ExtChat:Discord', e);
        });
        this.client.on('message', ((message) => {
            if (_.startsWith(message.content, '!player')) {
                const player = encodeURIComponent(message.content.substring(message.content.indexOf(' ')).trim());
                if (!player)
                    return;
                message.reply(`http://global.idle.land/players/${player}`);
                return;
            }
            if (_.startsWith(message.content, '!map')) {
                const map = encodeURIComponent(message.content.substring(message.content.indexOf(' ')).trim());
                if (!map)
                    return;
                message.reply(`http://global.idle.land/maps?map=${map}`);
                return;
            }
            if (_.startsWith(message.content, '!guild')) {
                const guild = encodeURIComponent(message.content.substring(message.content.indexOf(' ')).trim());
                if (!guild)
                    return;
                message.reply(`http://global.idle.land/guilds/${guild}`);
                return;
            }
            if (message.channel.id !== process.env.DISCORD_CHANNEL_ID || message.author.username === 'IdleLandsChat')
                return;
            const messageObject = {
                text: message.content,
                playerName: `<${message.author.username}>`,
                timestamp: Date.now(),
                channel: 'General',
                route: sendRoom,
                event: 'plugin:chat:sendmessage'
            };
            redis_1.SendChatMessage(messageObject, true);
        }));
    }
    sendMessage(msgData) {
        if (!isProd || !this.channel)
            return;
        this.channel.send(`<web:${msgData.playerName} [${msgData.guildTag || 'no guild'}] [${msgData.title || 'no title'}] [${msgData.ascensionLevel}~${msgData.level}]> ${msgData.text}`);
    }
}
exports.ExternalChatMechanism = ExternalChatMechanism;
