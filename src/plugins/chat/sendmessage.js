
import * as _ from 'lodash';
import { primus } from '../../primus/server';

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
    } else if(_.includes(messageObject.route, 'chat:channel:guild')) {
      const guildName = messageObject.route.split(':')[3];

      primus.forEach((spark, next) => {
        if(spark.guildName !== guildName) return;
        spark.write(messageObject);
        next();
      }, () => {});
    }

    if(messageObject.route === 'chat:channel:General' && primus.extChat && !fromExtChat) {
      primus.extChat.sendMessage(messageObject);
    }
  }
};