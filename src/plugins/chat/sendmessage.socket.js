
import _ from 'lodash';

import { GameState } from '../../core/game-state';
import { SETTINGS } from '../../static/settings';

const GENERAL_ROUTE = 'chat:channel:General';
const EVENTS_ROUTE  = 'chat:general:Global Events';

export const event = 'plugin:chat:sendmessage';
export const socket = (socket, primus) => {

  if(!primus.extChat) {
    primus.extChat = new (require(`./external.chat.${SETTINGS.externalChat}`).ExternalChatMechanism);
    primus.extChat.connect(primus, GENERAL_ROUTE);
  }

  // always join the general chat channel
  socket.join(GENERAL_ROUTE);
  socket.join(EVENTS_ROUTE);

  const sendmessage = async ({ text, channel, route, playerName }) => {
    if(!socket.authToken) return;

    const player = GameState.getInstance().retrievePlayer(playerName);

    if(player.isMuted || player.isBanned) return;

    text = _.truncate(text, { length: SETTINGS.chatMessageMaxLength, omission: ' [truncated]' }).trim();
    if(!text || !player || !playerName) return;

    const messageObject = { text, channel, route, title: player.title, playerName: player.nameEdit ? player.nameEdit : player.name, event };

    if(_.includes(route, ':pm:')) {
      const users = route.split(':')[2].split('|');
      primus.forEach(spark => {
        if(!_.includes(users, spark.playerName)) return;
        spark.write(messageObject);
      });
    } else {
      primus.room(route).write(messageObject);

      if(route === GENERAL_ROUTE) {
        primus.extChat.sendMessage(messageObject);
      }
    }
  };

  socket.on(event, sendmessage);
};