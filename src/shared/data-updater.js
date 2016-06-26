
import { primus } from '../../primus/server';

export const DataUpdater = (playerName, type, data) => {
  primus.room(playerName).write({ data, update: type });
};