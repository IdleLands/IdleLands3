
import _ from 'lodash';
import { MongoClient } from 'mongodb';

import { Logger } from './logger';

const connectionString = process.env.MONGOLAB_URI;

const mongoTag = `Mongo:${process.send ? 'Worker' : 'Core'}`;

let globalDb;
export class DbWrapper {

  connectionPromise() {
    return new Promise((resolve, reject) => {

      if(globalDb) {
        return resolve(globalDb);
      }

      Logger.info(mongoTag, 'Connecting to database...');

      MongoClient.connect(connectionString, async(err, db) => {

        if(err) {
          Logger.error('DB:Init', err);
          return reject(err);
        }

        db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);
        db.collection('players').createIndex({ userId: 1 }, { unique: true }, _.noop);

        db.collection('players').updateMany({}, { $set: { isOnline: false } });

        Logger.info(mongoTag, 'Connected!');
        globalDb = db;
        resolve(db);
      });
    });
  }
}