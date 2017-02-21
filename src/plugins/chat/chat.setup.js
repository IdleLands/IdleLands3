
import { SETTINGS } from '../../static/settings';

export const chatSetup = (primus) => {
  if(process.env.INSTANCE_NUMBER !== 0) return;
  if(!SETTINGS.externalChat) return;
  if(primus.extChat) return;

  primus.extChat = new (require(`./external.chat.${SETTINGS.externalChat}`).ExternalChatMechanism);
  primus.extChat.connect(primus, 'chat:channel:General');
};