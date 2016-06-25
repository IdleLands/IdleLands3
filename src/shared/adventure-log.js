
import { Logger } from './logger';
import { primus } from '../../primus/server';

const verifyMessage = (msg) => {
  if(!msg.type)
    return Logger.error('AdventureLog', new Error('No message type given.'), msg);
  if(!msg.text)
    return Logger.error('AdventureLog', new Error('No message text given.'), msg);
  if(!msg.highlights || !msg.highlights.length)
    return Logger.error('AdventureLog', new Error('No message highlights given.'), msg);
  if(!msg.targets && msg.type !== 'Global')
    return Logger.error('AdventureLog', new Error('No message targets given (message is not global).'), msg);

  return true;
};

export const MessageTypes = {
  GLOBAL: 'Global'
};

export const AdventureLog = (message) => {
  if(!verifyMessage(message)) return;

  if(process.env.NODE_ENV !== 'production') {
    Logger.info('AdventureLog', JSON.stringify(message));
  }

  primus.room('adventurelog').write(message);
};