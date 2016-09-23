
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

      MongoClient.connect(connectionString, { server: { poolSize: 50, auto_reconnect: true, socketOptions: { keepAlive: 1, connectTimeoutMS: 120000, socketTimeoutMS: 120000 } } }, async(err, db) => {

        if(err) {
          Logger.error('DB:Init', err);
          return reject(err);
        }

        db.on('close', function() {
          try {
            db.open();
          } catch (e) {
            Logger.error('DB:close, reopen attempt', e);
          }
        });

        db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);
        db.collection('players').createIndex({ userId: 1 }, { unique: true }, _.noop);

        db.collection('players').updateMany({}, { $set: { isOnline: false } });

        db.collection('battles').createIndex({ happenedAt: 1 }, { expireAfterSeconds: 21600 }, _.noop);

        Logger.info(mongoTag, 'Connected!');

        db.$$collections = {
          achievements:       db.collection('achievements'),
          battles:            db.collection('battles'),
          collectibles:       db.collection('collectibles'),
          personalities:      db.collection('personalities'),
          pets:               db.collection('pets'),
          players:            db.collection('players'),
          statistics:         db.collection('statistics')
        };

        resolve(db);
      });
    });

    return globalPromise;
  }
}
