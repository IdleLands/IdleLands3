
import { retrieveFromDb } from './battle.db';

export const event = 'plugin:battle:retrieve';
export const socket = (socket, primus, respond) => {

  const retrieve = async({ battleId }) => {
    try {
      const battle = await retrieveFromDb(battleId);
      respond(battle);
    } catch(e) {
      respond(e);
    }
  };

  socket.on(event, retrieve);
};