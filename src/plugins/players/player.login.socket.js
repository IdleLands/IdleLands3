
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import { Player } from './player';
import { PlayerDb } from './player.db';
import { emitter } from './_emitter';

import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';
import { MESSAGES } from '../../static/messages';

import { GameState } from '../../core/game-state';

const AUTH0_SECRET = process.env.AUTH0_SECRET;

export const event = 'plugin:player:login';
export const description = 'Log in or register a new character. Login only requires userId.';
export const args = 'name, gender, professionName, token, userId';
export const socket = (socket, primus, respond) => {

  const login = async({ name, gender, professionName, token, userId }) => {

    let player = null;
    let event = '';
    const playerDb = constitute(PlayerDb);

    if(!playerDb) {
      Logger.error('Login', new Error('playerDb could not be resolved.'));
      respond({ msg: MESSAGES.GENERIC });
      return;
    }

    const validateToken = process.env.NODE_ENV === 'production' || !_.includes(userId, 'local|');
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
      player = await playerDb.getPlayer({ userId });
      event = 'player:login';

    } catch(e) {

      // 20 char name is reasonable
      name = _.truncate(name, { length: 20 }).trim().replace(/[^\w\d ]/gm, '');
      name = name.split(' the ').join('');
      name = name.trim();

      if(name.length === 0) {
        return respond(MESSAGES.INVALID_NAME);
      }

      // sensible defaults
      if(!_.includes(['male', 'female'], gender)) gender = 'male';
      if(!_.includes(['Generalist', 'Mage', 'Cleric', 'Fighter'], professionName)) professionName = 'Generalist';

      let playerObject = {};
      try {
        playerObject = constitute(Player);
      } catch(e) {
        Logger.error('Login', e);
        return respond(MESSAGES.GENERIC);
      }

      playerObject.init({ _id: name, name, gender, professionName, userId });

      try {
        await playerDb.createPlayer(playerObject.buildSaveObject());
      } catch(e) {
        return respond(MESSAGES.PLAYER_EXISTS);
      }

      try {
        player = await playerDb.getPlayer({ userId, name });
      } catch(e) {
        Logger.error('Login', e);
        respond(MESSAGES.GENERIC);
      }
      event = 'player:register';
    }

    const gameState = GameState.getInstance();

    /* if(player.isOnline && !gameState._hasTimeout(player.name)) {
      // player already logged in, instead: disconnect this socket
      const msg = _.clone(MESSAGES.ALREADY_LOGGED_IN);
      msg.alreadyLoggedIn = true;
      respond(msg);
      socket.end();
      return;
    } */

    if(player.isBanned) {
      const msg = _.clone(MESSAGES.BANNED);
      msg.alreadyLoggedIn = true;
      respond(msg);
      socket.end();
      return;
    }

    try {
      socket.authToken = { playerName: player.name, token };
      socket.playerName = player.name;
    } catch(e) {
      Logger.error('login.socket.auth/name', e);
      return respond(MESSAGES.GENERIC);
    }

    // closed
    if(socket.readyState === 2) return;

    const oldPlayer = _.find(gameState.players, { name: player.name });

    if(gameState._hasTimeout(player.name)) {
      gameState._clearTimeout(player.name);

      if(oldPlayer) {
        oldPlayer.quickLogin();
        oldPlayer.update();
        emitter.emit('player:semilogin', { playerName: player.name });
      }

    }

    if(!oldPlayer) {
      emitter.emit(event, { playerName: player.name, fromIp: socket.address.ip });
    }

    const msg = _.clone(MESSAGES.LOGIN_SUCCESS);
    msg.ok = true;
    return respond(msg);
  };

  socket.on(event, login);
};