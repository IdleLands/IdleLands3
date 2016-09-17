
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';

import { Personalities } from './personalities';

@Dependencies(DbWrapper)
export class PersonalitiesDb {
  constructor(DbWrapper) {
    this.dbWrapper = DbWrapper;
  }

  async getPersonalities(id) {
    const db = await this.dbWrapper.connectionPromise();
    const personalities = db.$$collections.personalities;

    return new Promise((resolve, reject) => {
      personalities.find({ _id: id }).limit(1).next((err, doc) => {

        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        try {
          const personalities = constitute(Personalities);
          personalities.init(doc);
          resolve(personalities);
        } catch(e) {
          Logger.error('PersonalitiesDb:getPersonalities', e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  }

  async savePersonalities(personalitiesObject) {
    const db = await this.dbWrapper.connectionPromise();
    const personalities = db.$$collections.personalities;

    return new Promise((resolve) => {
      personalities.findOneAndUpdate({ _id: personalitiesObject._id }, 
        { $set: {
          activePersonalities: personalitiesObject.activePersonalities ,
          earnedPersonalities: personalitiesObject.earnedPersonalities
        } }, 
        { upsert: true }, 
        (err) =>{
          if (!err) {
            resolve(personalities);
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
