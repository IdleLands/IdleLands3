
import { getPlayer } from './player.db';

export const socket = (socket) => {

  const exists = async ({ userId }, respond) => {
    try {
      await getPlayer({ userId });
      respond({ exists: true });
    } catch(e) {
      respond({ exists: false });
    }
  };

  socket.on('plugin:player:exists', exists);
};