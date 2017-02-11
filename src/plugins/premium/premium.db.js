
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';

import { Premium } from './premium';

@Dependencies(DbWrapper)
export class PremiumDb {
  constructor(DbWrapper) {
    this.dbWrapper = DbWrapper;
  }

  async getPremium(id) {
    const db = await this.dbWrapper.connectionPromise();
    const premiums = db.$$collections.premiums;

    return new Promise((resolve, reject) => {
      premiums.find({ _id: id }).limit(1).next((err, doc) => {

        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        try {
          const premium = constitute(Premium);
          premium.init(doc);
          resolve(premium);
        } catch(e) {
          Logger.error('PremiumDb:getPremium', e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  }

  async savePremium(premiumObject) {
    const db = await this.dbWrapper.connectionPromise();
    const premiums = db.$$collections.premiums;

    return new Promise((resolve) => {
      premiums.findOneAndUpdate(
        { _id: premiumObject._id },
        { $set: {
          ilp: premiumObject.ilp,
          oneTimeItemsPurchased: premiumObject.oneTimeItemsPurchased,
          donatorFirstTimeBonus: premiumObject.donatorFirstTimeBonus
        } },
        { upsert: true },
        (err) => {
          if (!err) {
            resolve(premiumObject);
          } else {
            // process.stdout.write('c');
            // TOFIX: for now, just dump these. it's failed, typically from high load. Hopefully the next save will work better
            // MONGOERRORIGNORE
          }
        });
    });
  }
}
