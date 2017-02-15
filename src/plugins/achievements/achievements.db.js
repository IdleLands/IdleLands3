
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';

import { Achievements } from './achievements';

@Dependencies(DbWrapper)
export class AchievementsDb {
  constructor(DbWrapper) {
    this.dbWrapper = DbWrapper;
  }

  async getAchievements(id) {
    const db = await this.dbWrapper.connectionPromise();
    const achievements = db.$$collections.achievements;

    return new Promise((resolve, reject) => {
      achievements.find({ _id: id }).limit(1).next((err, doc) => {

        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        try {
          const achievements = constitute(Achievements);
          achievements.init(doc);
          resolve(achievements);
        } catch(e) {
          Logger.error('AchievementsDb:getAchievements', e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  }

  async saveAchievements(achievementsObject) {
    const db = await this.dbWrapper.connectionPromise();
    const achievements = db.$$collections.achievements;

    return new Promise((resolve) => {
      achievements.findOneAndUpdate({ _id: achievementsObject._id }, { $set: {
        achievements: achievementsObject.achievements,
        uniqueAchievements: achievementsObject.uniqueAchievements,
        totalAchievementTiers: achievementsObject.totalAchievementTiers,
        totalTitles: achievementsObject.totalTitles
      } }, { upsert: true }, (err) =>{
        if (!err) {
          resolve(achievements);
        } else {
          // process.stdout.write('a');
          // TOFIX: for now, just dump these. it's failed, typically from high load. Hopefully the next save will work better
          // MONGOERRORIGNORE
        }
      });
    });
  }
}
