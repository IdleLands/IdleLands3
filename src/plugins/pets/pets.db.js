
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

  async getPets(id) {
    const db = await this.dbWrapper.connectionPromise();
    const pets = db.$$collections.pets;

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

  async savePets(petsObject) {
    const db = await this.dbWrapper.connectionPromise();
    const pets = db.$$collections.pets;

    return new Promise((resolve) => {
      pets.findOneAndUpdate({ _id: petsObject._id },
        { $set: {
          activePetId: petsObject.activePetId,
          earnedPetData: petsObject.earnedPetData,
          earnedPets: petsObject.earnedPets
        } },
        { upsert: true },
        (err) =>{
          if (!err) {
            resolve(pets);
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
