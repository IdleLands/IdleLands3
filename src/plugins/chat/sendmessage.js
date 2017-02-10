
import _ from 'lodash';
import { primus } from '../../primus/server';

export const sendMessage = (messageObject) => {
  if(_.includes(messageObject.route, ':pm:')) {
    const users = messageObject.route.split(':')[2].split('|');
    primus.forEach((spark, next) => {
      if(!_.includes(users, spark.playerName)) return next();
      spark.write(messageObject);
      next();
    }, () => {});
  } else {
    primus.room(messageObject.route).write(messageObject);

    if(messageObject.route === 'General' && primus.extChat) {
      primus.extChat.sendMessage(messageObject);
    }
  }
};