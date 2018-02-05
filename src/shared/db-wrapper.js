
import * as _ from 'lodash';
import { MongoClient } from 'mongodb';

import { Logger } from './logger';

const connectionString = process.env.MONGODB_URI;

const mongoTag = `Mongo:${process.send ? 'Worker' : 'Core'}`;

const playerIndexes = [
  { gold: -1 },
  { 'statCache.luk': -1 },
  { allIps: 1, isMuted: 1 },
  { isOnline: 1 }
];

const statisticIndexes = [
  { 'stats.Character.Steps': -1 },
  { 'stats.Combat.Receive.Damage': -1 },
  { 'stats.Combat.Win': -1 },
  { 'stats.Combat.Kills.Player': -1 },
  { 'stats.Combat.Give.Damage': -1 },
  { 'stats.Character.Events': -1 },
  { 'stats.Character.Event.Providence': -1 },
  { 'stats.Combat.Kills.Monster': -1 },
  { 'stats.Character.Movement.Party': -1 },
  { 'stats.Character.Movement.Camping': -1 },
  { 'stats.Character.Movement.Drunk': -1 },
  { 'stats.Character.Terrains.Acid': -1 },
  { 'stats.Combat.Give.Overkill': -1 },
  { 'stats.Character.Movement.Solo': -1 },
  { 'stats.Character.Ascension.Gold': -1 },
  { 'stats.Character.Ascension.ItemScore': -1 },
  { 'stats.Character.Ascension.CollectiblesFound': -1 }
];

const achievementIndexes = [
  { uniqueAchievements: -1 },
  { totalTitles: -1 }
];

const collectibleIndexes = [
  { uniqueCollectibles: -1 }
];

const petIndexes = [
  { activePetId: 1 }
];

const guildIndexes = [
  { name: 1 }
];

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

      MongoClient.connect(connectionString, {
        native_parser: true,
        poolSize: 10,
        autoReconnect: true,
        keepAlive: 1,
        connectTimeoutMS: 120000,
        socketTimeoutMS: 120000
      }, async(err, db) => {

        if(err) {
          Logger.error('DB:Init', err);
          return reject(err);
        }

        db.on('close', () => {
          try {
            db.open();
            Logger.info('DB:Close', 'Attempted reopen.');
          } catch (e) {
            Logger.error('DB:Close', e);
          }
        });

        db.on('error', e => {
          Logger.error('DB:Err', e);
        });

        db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);
        db.collection('players').createIndex({ userId: 1 }, { unique: true }, _.noop);

        if(_.isUndefined(process.env.INSTANCE_NUMBER) || process.env.INSTANCE_NUMBER == 0) {
          db.collection('players').updateMany({}, { $set: { isOnline: false } });
        }

        db.collection('battles').createIndex({ happenedAt: 1 }, { expireAfterSeconds: 1800 }, _.noop);

        db.collection('guilds').createIndex({ name: 1 }, { unique: true }, _.noop);
        db.collection('guilds').createIndex({ tag: 1 }, { unique: true }, _.noop);

        _.each(playerIndexes, index => db.collection('players').createIndex(index, _.noop));
        _.each(statisticIndexes, index => db.collection('statistics').createIndex(index, _.noop));
        _.each(achievementIndexes, index => db.collection('achievements').createIndex(index, _.noop));
        _.each(collectibleIndexes, index => db.collection('collectibles').createIndex(index, _.noop));
        _.each(petIndexes, index => db.collection('pets').createIndex(index, _.noop));
        _.each(guildIndexes, index => db.collection('guilds').createIndex(index, _.noop));

        Logger.info(mongoTag, 'Connected!');

        db.$$collections = {
          achievements:       db.collection('achievements'),
          battles:            db.collection('battles'),
          collectibles:       db.collection('collectibles'),
          personalities:      db.collection('personalities'),
          pets:               db.collection('pets'),
          players:            db.collection('players'),
          statistics:         db.collection('statistics'),
          festivals:          db.collection('festivals'),
          premiums:           db.collection('premiums'),
          guilds:             db.collection('guilds')
        };

        resolve(db);
      });
    });

    return globalPromise;
  }
}
