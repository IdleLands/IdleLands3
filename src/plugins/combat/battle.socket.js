
import { retrieveFromDb } from './battle.db';
import { DataUpdater } from '../../shared/data-updater';

export const event = 'plugin:combat:retrieve';
export const description = 'Retrieve a battle from the database.';
export const args = 'battleName, playerName';
export const socket = (socket, primus, respond) => {

  const retrieve = async({ battleName, playerName }) => {
    try {
      const battle = await retrieveFromDb(battleName);
      DataUpdater(playerName, 'battle', battle);
    } catch(e) {
      respond(e);
      DataUpdater(playerName, 'battle', { msg: 'This battle does not exist or has expired.' });
    }
  };

  socket.on(event, retrieve);
};