
export const sendSystemMessage = (text) => {
  require('../primus/server').primus.room('chat:channel:General').write({
    timestamp: Date.now(),
    text,
    channel: 'General',
    route: 'chat:channel:General',
    event: 'plugin:chat:sendmessage',
    playerName: '<system>',
    ip: '<system>',
    isMod: true
  });
};