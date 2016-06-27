
export const event = 'plugin:chat:joinchannel';
export const socket = (socket, primus, respond) => {

  const joinchannel = async ({ }) => {

  };

  socket.on(event, joinchannel);
};