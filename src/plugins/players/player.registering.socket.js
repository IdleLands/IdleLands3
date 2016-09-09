
export const event = 'plugin:player:imregisteringrightnowdontkillme';
export const args = '';
export const description = 'Send this to the server to not have your socket killed while registering.';
export const socket = (socket) => {

  const registering = () => {
    socket._registering = true;
  };

  socket.on(event, registering);
};