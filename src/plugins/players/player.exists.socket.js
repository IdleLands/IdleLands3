
import constitute from 'constitute';

import { PlayerDb } from './player.db';

export const event = 'plugin:player:exists';
export const socket = (socket, primus, respond) => {

  const playerDb = constitute(PlayerDb);

  if(!playerDb) {
    // Logger?
    throw new Error('PlayerDb could not be resolved.');
  }

  const exists = async({ userId }) => {
    try {
      await playerDb.getPlayer({ userId });
      respond({ exists: true });
    } catch(e) {
      respond({ exists: false });
    }
  };

  socket.on(event, exists);
};