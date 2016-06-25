
import constitute from 'constitute';

import { PlayerDb } from './player.db';

export const socket = (socket) => {

  const playerDb = constitute(PlayerDb);

  if(!playerDb) {
    // Logger?
    throw new Error('PlayerDb could not be resolved.');
  }

  const exists = async ({ userId }, respond) => {
    try {
      await playerDb.getPlayer({ userId });
      respond({ exists: true });
    } catch(e) {
      respond({ exists: false });
    }
  };

  socket.on('plugin:player:exists', exists);
};