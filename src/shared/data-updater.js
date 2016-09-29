
export const DataUpdater = (playerName, type, data) => {
  // Would initialise server with testing if imported on top.
  const primus = require('../primus/server').primus;

  primus.emitToPlayers([playerName], { data, update: type });
};