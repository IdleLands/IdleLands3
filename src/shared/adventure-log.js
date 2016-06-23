
import { Logger } from './logger';

const verifyMessage = (msg) => {
  if(!msg.type)
    return Logger.error('AdventureLog', new Error('No message type given.'), msg);
  if(!msg.text)
    return Logger.error('AdventureLog', new Error('No message text given.'), msg);
  if(!msg.targets && msg.type !== 'Global')
    return Logger.error('AdventureLog', new Error('No message targets given (message is not global).'), msg);

  return true;
};

export const MessageTypes = {
  GLOBAL: 'Global'
};

export const AdventureLog = (worker, message) => {
  if(!verifyMessage(message)) return;

  if(process.env.NODE_ENV !== 'production') {
    Logger.info('AdventureLog', JSON.stringify(message));
  }

  worker.exchange.publish('adventurelog', message);
};