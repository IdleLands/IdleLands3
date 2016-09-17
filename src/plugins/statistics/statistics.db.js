
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';

import { Statistics } from './statistics';

@Dependencies(DbWrapper)
export class StatisticsDb {
  constructor(DbWrapper) {
    this.dbWrapper = DbWrapper;
  }

  async getStatistics(id) {
    const db = await this.dbWrapper.connectionPromise();
    const statistics = db.$$collections.statistics;

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
    const db = await this.dbWrapper.connectionPromise();
    const statistics = db.$$collections.statistics;

    return new Promise((resolve) => {
      statistics.findOneAndUpdate({ _id: statsObject._id }, { $set: { stats: statsObject.stats } }, { upsert: true }, (err) =>{
        if (!err) {
          resolve(statistics);
        } else {
          // process.stdout.write('s');
          // TOFIX: for now, just dump these. it's failed, typically from high load. Hopefully the next save will work better
          // MONGOERRORIGNORE
        }
      });
    });
  }
}
