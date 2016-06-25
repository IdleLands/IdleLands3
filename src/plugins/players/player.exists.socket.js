
import { getPlayer } from './player.db';

export const socket = (socket, primus, respond) => {

  const exists = async ({ userId }) => {
    try {
      await getPlayer({ userId });
      respond({ exists: true });
    } catch(e) {
      respond({ exists: false });
    }
  };

  socket.on('plugin:player:exists', exists);
};