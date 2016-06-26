
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';

@Dependencies(DbWrapper)
export class PlayerDb {
  constructor(dbWrapper) {
    this.DbWrapper = dbWrapper;
  }

  async getPlayer(opts) {
    const db = await this.DbWrapper.connectionPromise();
    const players = db.collection('players');

    return new Promise((resolve, reject) => {
      players.find(opts).limit(1).next(async(err, doc) => {
        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        if(!doc) {
          return reject({ err, msg: MESSAGES.NO_PLAYER });
        }

        resolve(doc);
      });
    });
  }

  async createPlayer(playerObject) {
    const db = await this.DbWrapper.connectionPromise();
    const players = db.collection('players');

    return new Promise((resolve, reject) => {
      players.insertOne(playerObject).then(() => {
        resolve(playerObject);
      }, reject);
    });
  }

  async savePlayer(playerObject) {
    const savePlayerObject = playerObject.buildSaveObject();
    const db = await this.DbWrapper.connectionPromise();
    const players = db.collection('players');

    return new Promise((resolve, reject) => {
      players.findOneAndUpdate({ _id: savePlayerObject._id }, savePlayerObject, { upsert: true }).then(() => {
        resolve(playerObject);
      }, reject);
    });
  }
}
