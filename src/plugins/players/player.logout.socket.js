
import { emitter } from './_emitter';

export const event = 'plugin:player:logout';
export const socket = (socket) => {

  const logout = async () => {
    if(!socket.authToken) return;
    const { playerName } = socket.authToken;

    emitter.emit('player:logout', { playerName });
  };

  socket.on('end', logout);
  socket.on(event, logout);
};