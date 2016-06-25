
import _ from 'lodash';
import { Dependencies, constitute } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';

import { Player } from './player';

import { Statistics } from '../statistics/statistics';
import { getStatistics, saveStatistics } from '../statistics/statistics.db';

@Dependencies(DbWrapper)
export class PlayerDb {
  constructor(DbWrapper) {
    this.DbWrapper = DbWrapper;
  }

  async getPlayer(opts) {
    const db = await this.DbWrapper.connectionPromise();
    const players = db.collection('players');

    return new Promise((resolve, reject) => {
      players.find(opts).limit(1).next(async (err, doc) => {
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
            const statisticsObj = new Statistics({ _id: player.name, stats: {} });
            const newStatistics = await saveStatistics(statisticsObj);
            player.statisticsLink = newStatistics._id;
            player.$statistics = statisticsObj;
          } else {
            player.$statistics = await getStatistics(player.name);
          }

          resolve(player);
        } catch(e) {
          console.log(e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  };

  async createPlayer(playerObject) {
    const db = await this.DbWrapper.connectionPromise();
    const players = db.collection('players');

    return new Promise((resolve, reject) => {
      players.insertOne(playerObject).then(() => {
        resolve(playerObject);
      }, reject);
    });
  };

  async savePlayer(playerObject) {
    const savePlayerObject = _.omitBy(playerObject, (val, key) => _.startsWith(key, '$'));
    const db = await this.DbWrapper.connectionPromise();
    const players = db.collection('players');

    return new Promise((resolve, reject) => {
      players.findOneAndUpdate({ _id: savePlayerObject._id }, savePlayerObject, { upsert: true }).then(() => {
        resolve(playerObject);
      }, reject);
    });
  };
}
