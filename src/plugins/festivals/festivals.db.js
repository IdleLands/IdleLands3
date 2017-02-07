
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';

@Dependencies(DbWrapper)
export class FestivalsDb {
  constructor(DbWrapper) {
    this.dbWrapper = DbWrapper;
  }

  async getFestivals() {
    const db = await this.dbWrapper.connectionPromise();
    const festivals = db.$$collections.festivals;

    return new Promise((resolve, reject) => {
      festivals.find({}, (err, docs) => {

        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        try {
          docs.toArray((err, data) => {
            resolve(data);
          });
        } catch(e) {
          Logger.error('FestivalsDb:getFestivals', e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  }

  async removeFestival(festivalObject) {
    const db = await this.dbWrapper.connectionPromise();
    const festivals = db.$$collections.festivals;

    return new Promise((resolve) => {
      festivals.remove({ _id: festivalObject._id },
        (err) =>{
          if (!err) {
            resolve(festivalObject);
          } else {
            // process.stdout.write('p');
            // TOFIX: for now, just dump these. it's failed, typically from high load. Hopefully the next save will work better
            // MONGOERRORIGNORE
          }
        }
      );
    });
  }

  async saveFestival(festivalObject) {
    const db = await this.dbWrapper.connectionPromise();
    const festivals = db.$$collections.festivals;

    return new Promise((resolve) => {
      festivals.insert(festivalObject,
        (err) =>{
          if (!err) {
            resolve(festivalObject);
          } else {
            // process.stdout.write('p');
            // TOFIX: for now, just dump these. it's failed, typically from high load. Hopefully the next save will work better
            // MONGOERRORIGNORE
          }
        }
      );
    });
  }
}
