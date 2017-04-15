
import * as _ from 'lodash';
import { primus } from '../../primus/server';

import { GameState } from '../../core/game-state';

export const sendMessage = (messageObject, fromExtChat = false) => {
  if(_.includes(messageObject.route, ':pm:')) {
    const users = messageObject.route.split(':')[2].split('|');
    primus.forEach((spark, next) => {
      if(!_.includes(users, spark.playerName)) return next();
      spark.write(messageObject);
      next();
    }, () => {});
  } else {
    if(messageObject.route === 'chat:channel:General') {
      primus.forEach((spark, next) => {
        spark.write(messageObject);
        next();
      }, () => {});
    } else if(_.includes(messageObject.route, 'chat:channel:Guild')) {
      const guildName = messageObject.route.split(':')[3];

      _.each(GameState.getInstance().getPlayers(), player => {
        if(player.guildName !== guildName) return;

        _.each(primus.players[player.name], spark => {
          spark.write(messageObject);
        });
      });
    }

    if(messageObject.route === 'chat:channel:General' && primus.extChat && !fromExtChat) {
      primus.extChat.sendMessage(messageObject);
    }
  }
};