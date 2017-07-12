
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';
import { constitute } from '../../shared/di-wrapper';

import { Pets } from './pets';

@Dependencies(DbWrapper)
export class PetsDb {
  constructor(DbWrapper) {
    this.dbWrapper = DbWrapper;
  }

  async getPets(id, debug = false) {
    const db = await this.dbWrapper.connectionPromise();
    const pets = db.$$collections.pets;
    if(debug) console.log('[mid] getPets db connection established');

    return new Promise((resolve, reject) => {
      pets.find({ _id: id }).limit(1).next((err, doc) => {

        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        try {
          const pets = constitute(Pets);
          pets.init(doc);
          resolve(pets);
        } catch(e) {
          Logger.error('PetsDb:getPets', e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  }

  async savePets(petsObject, debug = false) {
    const db = await this.dbWrapper.connectionPromise();
    const pets = db.$$collections.pets;
    if(debug) console.log('[mid] savePets db connection established');

    return new Promise((resolve, reject) => {
      pets.updateOne({ _id: petsObject._id },
        { $set: {
          activePetId: petsObject.activePetId,
          earnedPetData: petsObject.earnedPetData,
          earnedPets: petsObject.earnedPets
        } },
        { upsert: true },
        (err) => {

          if(err) {
            return reject(err);
          }

          resolve(pets);
        }
      );
    });
  }
}
