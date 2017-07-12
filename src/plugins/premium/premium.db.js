
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

  async getPremium(id, debug = false) {
    const db = await this.dbWrapper.connectionPromise();
    const premiums = db.$$collections.premiums;
    if(debug) console.log('[mid] getPremium db connection established');

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

  async savePremium(premiumObject, debug = false) {
    const db = await this.dbWrapper.connectionPromise();
    const premiums = db.$$collections.premiums;
    if(debug) console.log('[mid] savePremium db connection established');

    return new Promise((resolve, reject) => {
      premiums.updateOne(
        { _id: premiumObject._id },
        { $set: {
          ilp: premiumObject.ilp,
          oneTimeItemsPurchased: premiumObject.oneTimeItemsPurchased,
          donatorFirstTimeBonus: premiumObject.donatorFirstTimeBonus,
          consumables: premiumObject.consumables
        } },
        { upsert: true },
        (err) => {
          if(err) {
            return reject(err);
          }

          resolve(premiumObject);
        });
    });
  }
}
