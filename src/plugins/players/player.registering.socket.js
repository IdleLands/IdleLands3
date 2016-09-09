
export const event = 'plugin:player:imregisteringrightnowdontkillme';
export const socket = (socket) => {

  const registering = () => {
    socket._registering = true;
  };

  socket.on(event, registering);
};