
import _ from 'lodash';
import { SETTINGS } from '../../static/settings';

export const chatSetup = (primus) => {
  if(_.isNumber(process.env.INSTANCE_NUMBER) && process.env.INSTANCE_NUMBER === 0) {
    if(!primus.extChat && SETTINGS.externalChat) {
      primus.extChat = new (require(`./external.chat.${SETTINGS.externalChat}`).ExternalChatMechanism);
      primus.extChat.connect(primus, 'chat:channel:General');
    }
  }
};