
import { removePlayer } from './player.worker';

export const socket = (socket, worker) => {

  const logout = async () => {
    if(!socket.getAuthToken()) return;
    const { playerName } = socket.getAuthToken();
    removePlayer(worker, playerName);

    worker.playerNameToSocket[playerName] = null;
    worker.sendToMaster({
      event: 'player:logout',
      playerName
    });
  };

  socket.on('disconnect', logout);
  socket.on('plugin:player:logout', logout);
};