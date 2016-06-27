
import _ from 'lodash';

import { GameState } from '../../core/game-state';

import { SETTINGS } from '../../static/settings';

export const event = 'plugin:chat:sendmessage';
export const socket = (socket, primus) => {

  // always join the general chat channel
  socket.join('chat:channel:General');

  const sendmessage = async ({ text, channel, route, playerName }) => {
    if(!socket.authToken) return;

    const player = GameState.retrievePlayer(playerName);

    text = _.truncate(text, { length: SETTINGS.chatMessageMaxLength, omission: ' [truncated]' }).trim();
    if(!text || !player || !playerName) return;

    const messageObject = { text, channel, route, title: player.title, playerName, event };

    if(_.includes(route, ':pm:')) {
      const users = route.split(':')[2].split('|');
      primus.forEach(spark => {
        if(!_.includes(users, spark.playerName)) return;
        spark.write(messageObject);
      });
    } else {
      primus.room(route).write(messageObject);
    }
  };

  socket.on(event, sendmessage);
};