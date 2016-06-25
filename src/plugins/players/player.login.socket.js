
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import constitute from 'constitute';

import { addPlayer } from './player.worker';
import { PlayerDb } from './player.db';

import { Player } from './player';
import { emitter } from './_emitter';

import { Logger } from '../../shared/logger';
import { MESSAGES } from '../../static/messages';

const AUTH0_SECRET = process.env.AUTH0_SECRET;

export const socket = (socket, worker) => {

  const login = async ({ name, gender, professionName, token, userId }, respond) => {
    let player = null;
    let event = '';
    const playerDb = constitute(PlayerDb);

    if(!playerDb) {
      respond({ msg: MESSAGES.GENERIC });
      Logger.error('Login', new Error('playerDb could not be resolved.'));
    }

    const validateToken = !_.includes(userId, 'local|');
    if(validateToken) {
      if(AUTH0_SECRET) {
        try {
          jwt.verify(token, new Buffer(AUTH0_SECRET, 'base64'), { algorithms: ['HS256'] });
        } catch(e) {
          return respond({ msg: MESSAGES.INVALID_TOKEN });
        }
      } else {
        Logger.error('Login', new Error('Token needs to be validated, but no AUTH0_TOKEN is present.'));
      }
    }

    try {
      player = await playerDb.getPlayer(userId);
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

      let playerObject = {};
      try {
        playerObject = constitute(Player);
      } catch (e) {
        Logger.error('Login', e);
      }
      playerObject.init({ _id: name, name, gender, professionName, userId });

      try {
        await playerDb.createPlayer(playerObject);
      } catch(e) {
        return respond({ msg: MESSAGES.PLAYER_EXISTS });
      }

      try {
        player = await playerDb.getPlayer({ userId, name });
      } catch (e) {
        Logger.error('Login', e);
        respond({ msg: MESSAGES.GENERIC });
      }
      event = 'player:register';
    }

    try {
      await addPlayer(worker, name);
      socket.setAuthToken({ playerName: player.name, token });

      player.$worker = worker;

      emitter.emit(event, { worker, player });

      return respond({ ok: true });

    // player already logged in, instead: disconnect this socket
    } catch(e) {
      Logger.error('Login', e);
      respond({ alreadyLoggedIn: true, msg: MESSAGES.ALREADY_LOGGED_IN });
      socket.disconnect();
    }
  };

  socket.on('plugin:player:login', login);
};