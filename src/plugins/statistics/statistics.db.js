import { Dependencies, constitute } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';

import { Statistics } from './statistics';

@Dependencies(DbWrapper)
export class StatisticsDb {
  constructor(DbWrapper) {
    this.DbWrapper = DbWrapper;
  }

  async getStatistics(id) {
    const db = await this.DbWrapper.connectionPromise();
    const statistics = db.collection('statistics');

    return new Promise((resolve, reject) => {
      statistics.find({ _id: id }).limit(1).next((err, doc) => {

        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        try {
          const statistics = constitute(Statistics);
          statistics.init(doc);
          resolve(statistics);
        } catch(e) {
          Logger.error('StatisticsDb:getStatistics', e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  }

  async saveStatistics(statsObject) {
    const db = await this.DbWrapper.connectionPromise();
    const statistics = db.collection('statistics');

    return new Promise((resolve) => {
      statistics.findOneAndUpdate({ _id: statsObject._id }, { $set: { stats: statsObject.stats } }, { upsert: true }).then((doc) => {
        statsObject.init(doc.value);
        resolve(statistics);
      });
    });
  }
}
