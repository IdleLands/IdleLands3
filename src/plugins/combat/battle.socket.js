
import { retrieveFromDb } from './battle.db';
import { Logger } from '../../shared/logger';

export const event = 'plugin:combat:retrieve';
export const description = 'Retrieve a battle from the database.';
export const args = 'battleName, playerName';
export const socket = (socket, primus, respond) => {

  const retrieve = async({ battleName }) => {
    try {
      const battle = await retrieveFromDb(battleName);
      if (!battle) return;
      Logger.info('Socket:Battle', `${socket.address.ip} requesting ${battleName}.`);
      respond({ data: battle, update: 'battle' });
    } catch(e) {
      respond({ data: { msg: 'This battle does not exist or has expired.' }, update: 'battle' });
    }
  };

  socket.on(event, retrieve);
};