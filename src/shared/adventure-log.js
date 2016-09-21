
import _ from 'lodash';

import { Logger } from './logger';
import { primus } from '../primus/server';

const verifyMessage = (msg) => {
  if(!msg.type)
    return Logger.error('AdventureLog', new Error('No message type given.'), msg);
  if(!msg.text)
    return Logger.error('AdventureLog', new Error('No message text given.'), msg);
  if(!msg.category)
    return Logger.error('AdventureLog', new Error('No message category given.'), msg);
  if(!msg.targets && msg.type !== 'Global')
    return Logger.error('AdventureLog', new Error('No message targets given (message is not global).'), msg);

  return true;
};

export const MessageCategories = {
  META: 'Meta',
  EXPLORE: 'Explore',
  LEVELUP: 'Levelup',
  ACHIEVEMENT: 'Achievement',
  COMBAT: 'Combat',
  PET: 'Pet',
  GUILD: 'Guild',
  TOWNCRIER: 'Towncrier',
  PARTY: 'Party',
  ITEM: 'Item',
  GOLD: 'Gold',
  PROFESSION: 'Profession',
  XP: 'Xp'
};

export const MessageTypes = {
  GLOBAL: 'Global',
  SINGLE: 'Single'
};

export const AdventureLog = (message) => {
  if(!verifyMessage(message)) return;

  if(process.env.NODE_ENV !== 'production') {
    Logger.info('AdventureLog', JSON.stringify(message));
  }

  message.event = 'adventurelog';
  _.each(message.targets, target => {
    primus.forEach((spark, next) => {
      if(!spark.authToken || spark.authToken.playerName !== target) return next();
      spark.write(message);
      next();
    }, () => {});
  });
};