
export const DataUpdater = (playerName, type, data) => {
  // Would initialise server with testing if imported on top.
  const primus = require('../primus/server').primus;

  const updater = (spark) => {
    if(!spark.authToken || spark.authToken.playerName !== playerName) return;
    spark.write({ data, update: type });
  };

  primus.forEach(updater);
};