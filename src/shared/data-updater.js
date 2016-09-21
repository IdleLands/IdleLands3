
export const DataUpdater = (playerName, type, data) => {
  // Would initialise server with testing if imported on top.
  const primus = require('../primus/server').primus;

  const updater = (spark, next) => {
    if(!spark.authToken || spark.authToken.playerName !== playerName) return next();
    spark.write({ data, update: type });
    next();
  };

  primus.forEach(updater, () => {});
};