
import _ from 'lodash';
import { MongoClient } from 'mongodb';

import { Logger } from './logger';

const connectionString = process.env.MONGODB_URI;

const mongoTag = `Mongo:${process.send ? 'Worker' : 'Core'}`;

let globalPromise;
export class DbWrapper {

  static get promise() {
    return globalPromise;
  }

  connectionPromise() {
    if(globalPromise) {
      return globalPromise;
    }

    globalPromise = new Promise((resolve, reject) => {
      Logger.info(mongoTag, 'Connecting to database...');

      MongoClient.connect(connectionString, async(err, db) => {

        if(err) {
          Logger.error('DB:Init', err);
          return reject(err);
        }

        db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);
        db.collection('players').createIndex({ userId: 1 }, { unique: true }, _.noop);

        db.collection('players').updateMany({}, { $set: { isOnline: false } });

        db.collection('battles').createIndex({ happenedAt: 1 }, { expireAfterSeconds: 7200 }, _.noop);

        Logger.info(mongoTag, 'Connected!');
        resolve(db);
      });
    });

    return globalPromise;
  }
}
