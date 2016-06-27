
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

    primus.room(route).write({ text, channel, route, title: player.title, playerName, event });
  };

  socket.on(event, sendmessage);
};