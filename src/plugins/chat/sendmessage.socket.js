
import _ from 'lodash';

import { GameState } from '../../core/game-state';
import { SETTINGS } from '../../static/settings';

const GENERAL_ROUTE = 'chat:channel:General';
// const EVENTS_ROUTE  = 'chat:general:Global Events';

const CHAT_SPAM_DELAY = process.env.CHAT_SPAM_DELAY || 2000;
const MAX_SPAM_MESSAGES = process.env.MAX_SPAM_MESSAGES || 5;
const SPAM_IGNORE_LEVEL = process.env.SPAM_IGNORE_LEVEL || 25;

export const event = 'plugin:chat:sendmessage';
export const description = 'Send a chat message.';
export const args = 'text, channel, route';
export const socket = (socket, primus) => {

  if(!primus.extChat) {
    primus.extChat = new (require(`./external.chat.${SETTINGS.externalChat}`).ExternalChatMechanism);
    primus.extChat.connect(primus, GENERAL_ROUTE);
  }

  // always join the general chat channel
  socket.join(GENERAL_ROUTE);
  // socket.join(EVENTS_ROUTE);

  const sendmessage = async ({ text, channel, route }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().retrievePlayer(playerName);
    if(!player || !player.isOnline || player.isMuted || player.isBanned) return;

    if(!player.lastSentMessage) player.lastSentMessage = Date.now();

    const timestamp = Date.now();
    if(!player.spamMessages || _.isNaN(player.spamMessages)) player.spamMessages = 0;
    if(timestamp - player.lastSentMessage < CHAT_SPAM_DELAY) player.spamMessages++;
    else                                                     player.spamMessages = Math.max(player.spamMessages-1, 0);

    if(player.spamMessages > MAX_SPAM_MESSAGES && player.level < SPAM_IGNORE_LEVEL) {
      player.isMuted = true;
      if(!player.autoMutes) player.autoMutes = 0;
      player.autoMutes++;
      player.spamMessages = 0;
    }

    player.lastSentMessage = Date.now();

    text = _.truncate(text, { length: SETTINGS.chatMessageMaxLength, omission: ' [truncated]' }).trim();
    if(!text) return;

    const messageObject = {
      text,
      timestamp,
      channel,
      route,
      title: player.title,
      playerName: player.nameEdit ? player.nameEdit : player.name,
      level: player.level,
      event,
      ip: player.$currentIp,
      isMod: player.isMod
    };

    if(_.includes(route, ':pm:')) {
      const users = route.split(':')[2].split('|');
      primus.forEach((spark, next) => {
        if(!_.includes(users, spark.playerName)) return next();
        spark.write(messageObject);
        next();
      }, () => {});
    } else {
      primus.room(route).write(messageObject);

      if(route === GENERAL_ROUTE) {
        primus.extChat.sendMessage(messageObject);
      }
    }
  };

  socket.on(event, sendmessage);
};