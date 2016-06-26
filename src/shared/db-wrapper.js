
import _ from 'lodash';
import { MongoClient } from 'mongodb';

import { Logger } from './logger';

const connectionString = process.env.MONGODB_URI;

const mongoTag = `Mongo:${process.send ? 'Worker' : 'Core'}`;

Logger.info(mongoTag, 'Connecting to database...');
const connectionPromise = new Promise((resolve, reject) => {

  MongoClient.connect(connectionString, async (err, db) => {

    if(err) {
      Logger.error('DB:Init', err);
      return reject(err);
    }

    db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);
    db.collection('players').createIndex({ userId: 1 }, { unique: true }, _.noop);

    db.collection('players').updateMany({}, { $set: { isOnline: false } });

    Logger.info(mongoTag, 'Connected!');
    resolve(db);
  });
});

export default () => connectionPromise;