
import _ from 'lodash';
import { MongoClient } from 'mongodb';

import { Logger } from './logger';

const connectionString = process.env.MONGOLAB_URI;

Logger.info('Mongo', 'Connecting to database...');
const connectionPromise = new Promise((resolve, reject) => {

  MongoClient.connect(connectionString, async (err, db) => {

    if(err) {
      Logger.error('DB:Init', err);
      return reject(err);
    }

    db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);

    Logger.info('Mongo', 'Connected!');
    resolve(db);
  });
});

export default () => connectionPromise;