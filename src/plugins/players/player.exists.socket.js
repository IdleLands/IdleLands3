
import { PlayerDb } from './player.db';

import { constitute } from '../../shared/di-wrapper';

export const event = 'plugin:player:exists';
export const description = 'Unauthenticated. Check if a particular player exists for auto-login purposes.';
export const args = 'userId';
export const socket = (socket, primus, respond) => {

  const playerDb = constitute(PlayerDb);

  if(!playerDb) {
    // Logger?
    throw new Error('$playerDb could not be resolved.');
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