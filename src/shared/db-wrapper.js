
import _ from 'lodash';
import { MongoClient } from 'mongodb';

import { Logger } from './logger';

const connectionString = process.env.MONGOLAB_URI;

export class DbWrapper {
  connectionPromise() {
    Logger.info('Mongo', 'Connecting to database...');
    return new Promise((resolve, reject) => {

      MongoClient.connect(connectionString, async(err, db) => {

        if (err) {
          Logger.error('DB:Init', err);
          return reject(err);
        }

        db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);
        db.collection('players').createIndex({ userId: 1 }, { unique: true }, _.noop);

        Logger.info('Mongo', 'Connected!');
        resolve(db);
      });
    });
  }
}