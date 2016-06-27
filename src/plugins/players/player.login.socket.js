
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import { getPlayer, createPlayer } from './player.db';
import { emitter } from './_emitter';

import { Logger } from '../../shared/logger';
import { MESSAGES } from '../../static/messages';

const AUTH0_SECRET = process.env.AUTH0_SECRET;

export const event = 'plugin:player:login';
export const socket = (socket, primus, respond) => {

  const login = async ({ name, gender, professionName, token, userId }) => {
    let player = null;
    let event = '';

    const validateToken = !_.includes(userId, 'local|');
    if(validateToken) {
      if(AUTH0_SECRET) {
        try {
          jwt.verify(token, new Buffer(AUTH0_SECRET, 'base64'), { algorithms: ['HS256'] });
        } catch(e) {
          return respond(MESSAGES.INVALID_TOKEN);
        }
      } else {
        Logger.error('Login', new Error('Token needs to be validated, but no AUTH0_TOKEN is present.'));
      }
    }

    try {
      player = await getPlayer({ userId });
      event = 'player:login';

    } catch(e) {

      // 20 char name is reasonable
      name = _.truncate(name, { length: 20 }).trim().replace(/[^\w]/gm, '');

      if(name.length === 0) {
        return respond(MESSAGES.INVALID_NAME);
      }

      // sensible defaults
      if(!_.includes(['male', 'female'], gender)) gender = 'male';
      if(!_.includes(['Generalist', 'Mage', 'Cleric', 'Fighter'], professionName)) professionName = 'Generalist';

      const playerObject = { _id: name, name, gender, professionName, userId };

      try {
        await createPlayer(playerObject);
      } catch(e) {
        return respond(MESSAGES.PLAYER_EXISTS);
      }

      player = await getPlayer({ userId, name });
      event = 'player:register';
    }

    if(player.isOnline) {
      // player already logged in, instead: disconnect this socket
      const msg = _.clone(MESSAGES.ALREADY_LOGGED_IN);
      msg.alreadyLoggedIn = true;
      respond(msg);
      socket.end();
      return;
    }

    socket.authToken = { playerName: player.name, token };
    socket.playerName = player.name;

    socket.join(player.name);

    emitter.emit(event, { playerName: player.name });

    const msg = _.clone(MESSAGES.LOGIN_SUCCESS);
    msg.ok = true;
    return respond(msg);
  };

  socket.on(event, login);
};