
export const DataUpdater = (playerName, type, data) => {
  // Would initialise server with testing if imported on top.
  const primus = require('../primus/server').primus;

  primus.forEach(spark => {
    if(!spark.authToken || spark.authToken.playerName !== playerName) return;
    spark.write({ data, update: type });
  });
};