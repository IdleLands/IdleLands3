
import _ from 'lodash';
import { Dependencies, constitute } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';

import { Player } from './player';

import { StatisticsDb } from '../statistics/statistics.db';

@Dependencies(DbWrapper, StatisticsDb)
export class PlayerDb {
  constructor(dbWrapper, statisticsDb) {
    this.DbWrapper = dbWrapper;
    this.StatisticsDb = statisticsDb;
  }

  async getPlayer(opts) {
    const db = await this.DbWrapper.connectionPromise();
    const players = db.collection('players');

    return new Promise((resolve, reject) => {
      players.find(opts).limit(1).next(async(err, doc) => {
        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        if(!doc) {
          return reject({ err, msg: MESSAGES.NO_PLAYER });
        }

        try {
          const player = constitute(Player);
          player.init(doc);

          if(!player.statisticsLink) {
            player.$statistics.init({ _id: player.name, stats: {} });
            const newStatistics = await this.StatisticsDb.saveStatistics(player.$statistics);
            player.statisticsLink = newStatistics._id;
          } else {
            player.$statistics = await this.StatisticsDb.getStatistics(player.name);
          }

          resolve(player);
        } catch(e) {
          Logger.error('PlayerDb:getPlayer', e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  }

  async createPlayer(playerObject) {
    const db = await this.DbWrapper.connectionPromise();
    const players = db.collection('players');

    return new Promise((resolve, reject) => {
      players.insertOne(playerObject).then(() => {
        resolve(playerObject);
      }, reject);
    });
  }

  async savePlayer(playerObject) {
    const savePlayerObject = _.omitBy(playerObject, (val, key) => _.startsWith(key, '$'));
    const db = await this.DbWrapper.connectionPromise();
    const players = db.collection('players');

    return new Promise((resolve, reject) => {
      players.findOneAndUpdate({ _id: savePlayerObject._id }, savePlayerObject, { upsert: true }).then(() => {
        resolve(playerObject);
      }, reject);
    });
  }
}
