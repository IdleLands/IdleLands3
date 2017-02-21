
import IRC from 'squelch-client';
import { SETTINGS } from '../../static/settings';
import { Logger } from '../../shared/logger';
import { SendChatMessage } from '../scaler/redis';

const isProd = process.env.NODE_ENV === 'production' && !process.env.EXT_CHAT;

const { server, nick, channel } = SETTINGS.chatConfig.irc;

export class ExternalChatMechanism {
  connect(primus, sendRoom) {
    if(!isProd) return;

    if(!primus) {
      Logger.error('ExtChat:IRC', new Error('Primus failed to inject correctly!'));
      return;
    }

    Logger.info('ExtChat:IRC', `Connecting to ${server}${channel} as ${nick}...`);

    this.client = new IRC({
      server,
      nick,
      channels: [channel],
      autoConnect: false
    });

    this.client.connect().then(() => {
      Logger.info('ExtChat:IRC', 'Connected!');
      this.isConnected = true;
      this.client.on('msg', ({ from, to, msg }) => {
        if(to !== '##idlebot') return;

        const messageObject = {
          text: msg,
          playerName: `<irc:${from}>`,
          timestamp: Date.now(),
          channel: 'General',
          route: sendRoom,
          event: 'plugin:chat:sendmessage'
        };

        SendChatMessage(messageObject, true);
      });
    });
  }

  sendMessage(msgData) {
    if(!isProd || !this.isConnected) return;
    this.client.msg(channel, `<web:${msgData.playerName} [${msgData.title || 'no title'}] [${msgData.level}]> ${msgData.text}`);
  }
}
