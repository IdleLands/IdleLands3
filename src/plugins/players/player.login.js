
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import atob from 'atob';

import { addPlayer } from './player.worker';
import { getPlayer, savePlayer } from './player.db';

import { Player } from './player';
import { emitter } from './_emitter';

import { Logger } from '../../shared/logger';
import { MESSAGES } from '../../static/messages';

const AUTH0_SECRET = process.env.AUTH0_SECRET;

export const socket = (socket, worker) => {

  const login = async ({ name, gender, professionName, token, userId }, respond) => {
    let player = null;
    let event = '';

    const validateToken = !_.includes(userId, 'local|');
    if(validateToken) {
      if(AUTH0_SECRET) {
        try {
          jwt.verify(token, atob(AUTH0_SECRET), { algorithms: ['HS256'] });
        } catch(e) {
          return respond({ msg: MESSAGES.INVALID_TOKEN });
        }
      } else {
        Logger.error('Login', new Error('Token needs to be validated, but no AUTH0_TOKEN is present.'));
      }
    }

    try {
      player = await getPlayer(userId);
      event = 'player:login';

    } catch(e) {

      // 20 char name is reasonable
      name = _.truncate(name, { length: 20 }).trim();

      if(name.length === 0) {
        return respond({ msg: MESSAGES.INVALID_NAME });
      }

      // sensible defaults
      if(!_.includes(['male', 'female'], gender)) gender = 'male';
      if(!_.includes(['Generalist', 'Mage', 'Cleric', 'Fighter'], professionName)) professionName = 'Generalist';

      const playerObject = new Player({ _id: name, name, gender, professionName, userId });

      try {
        await savePlayer(playerObject);
      } catch(e) {
        return respond({ msg: MESSAGES.PLAYER_EXISTS });
      }

      player = await getPlayer(userId);
      event = 'player:register';
    }

    try {
      await addPlayer(worker, name);
      socket.setAuthToken({ playerName: name, token });

      player.$worker = worker;

      emitter.emit(event, { worker, player });

    // player already logged in, instead: disconnect this socket
    } catch(e) {
      Logger.error('Login', e);
      socket.disconnect();
    }
  };

  socket.on('plugin:player:login', login);
};