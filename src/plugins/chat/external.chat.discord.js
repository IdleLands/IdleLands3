
import * as _ from 'lodash';
import * as Discord from 'discord.js';
import { Logger } from '../../shared/logger';
import { SendChatMessage } from '../scaler/redis';

const isProd = process.env.NODE_ENV === 'production' && !+process.env.EXT_CHAT;

export class ExternalChatMechanism {

  connect(primus, sendRoom) {
    if(!isProd) return;

    if(!primus) {
      Logger.error('ExtChat:Discord', new Error('Primus failed to inject correctly!'));
      return;
    }

    Logger.info('ExtChat:Discord', `Connecting...`);

    this.client = new Discord.Client();

    this.client.login(process.env.DISCORD_TOKEN).then(() => {
      Logger.info('ExtChat:Discord', `Connected!`);
      this.channel = this.client.channels.get(process.env.DISCORD_CHANNEL_ID);
    }).catch(e => {
      Logger.error('ExtChat:Discord', e);
    });

    this.client.on('message', ((message) => {

      if(_.startsWith(message.content, '!player')) {
        const player = encodeURIComponent(message.content.split(' ')[1]);
        if(!player) return;
        message.reply(`http://global.idle.land/players/${player}`);
        return;
      }

      if(_.startsWith(message.content, '!map')) {
        const map = encodeURIComponent(message.content.split(' ')[1]);
        if(!map) return;
        message.reply(`http://global.idle.land/maps?map=${map}`);
        return;
      }

      if(_.startsWith(message.content, '!guild')) {
        const guild = encodeURIComponent(message.content.split(' ')[1]);
        if(!guild) return;
        message.reply(`http://global.idle.land/guilds/${guild}`);
        return;
      }

      if(message.channel.id !== process.env.DISCORD_CHANNEL_ID) return;

      const messageObject = {
        text: message.content,
        playerName: `<${message.author.username}>`,
        timestamp: Date.now(),
        channel: 'General',
        route: sendRoom,
        event: 'plugin:chat:sendmessage'
      };

      SendChatMessage(messageObject, true);
    }));
  }

  sendMessage(msgData) {
    if(!isProd || !this.channel) return;

    this.channel.send(`<web:${msgData.playerName} [${msgData.guildTag || 'no guild'}] [${msgData.title || 'no title'}] [${msgData.ascensionLevel}~${msgData.level}]> ${msgData.text}`);
  }
}
