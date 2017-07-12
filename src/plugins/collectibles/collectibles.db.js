
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';

import { Collectibles } from './collectibles';

@Dependencies(DbWrapper)
export class CollectiblesDb {
  constructor(DbWrapper) {
    this.dbWrapper = DbWrapper;
  }

  async getCollectibles(id) {
    const db = await this.dbWrapper.connectionPromise();
    const collectibles = db.$$collections.collectibles;

    return new Promise((resolve, reject) => {
      collectibles.find({ _id: id }).limit(1).next((err, doc) => {

        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        try {
          const collectibles = constitute(Collectibles);
          collectibles.init(doc);
          resolve(collectibles);
        } catch(e) {
          Logger.error('CollectiblesDb:getCollectibles', e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  }

  async saveCollectibles(collectiblesObject) {
    const db = await this.dbWrapper.connectionPromise();
    const collectibles = db.$$collections.collectibles;

    return new Promise((resolve, reject) => {
      collectibles.updateOne({ _id: collectiblesObject._id }, { $set: {
        collectibles: collectiblesObject.collectibles,
        priorCollectibles: collectiblesObject.priorCollectibles,
        uniqueCollectibles: collectiblesObject.uniqueCollectibles
      } }, { upsert: true }, (err) =>{
        if(err) {
          return reject(err);
        }

        resolve(collectibles);
      });
    });
  }
}
