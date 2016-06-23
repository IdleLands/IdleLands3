
import { removePlayer } from './player.worker';
import { emitter } from './_emitter';

export const socket = (socket, worker) => {

  const logout = async () => {
    if(!socket.getAuthToken()) return;
    const { playerName } = socket.getAuthToken();
    removePlayer(worker, playerName);
    emitter.emit('player:logout', { worker, playerName });
  };

  socket.on('disconnect', logout);
  socket.on('plugin:player:logout', logout);
};