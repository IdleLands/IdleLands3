
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';

@Dependencies(DbWrapper)
export class PlayerDb {
  constructor(dbWrapper) {
    this.dbWrapper = dbWrapper;
  }

  async getPlayer(opts) {
    const db = await this.dbWrapper.connectionPromise();
    const players = db.$$collections.players;

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

  async getOffenses(ip) {
    const db = await this.dbWrapper.connectionPromise();
    const players = db.$$collections.players;

    return new Promise((resolve, reject) => {
      players.find({ allIps: ip, isMuted: true }).limit(1).next(async(err, doc) => {
        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }
        resolve(doc);
      });
    });
  }

  async createPlayer(playerObject) {
    const db = await this.dbWrapper.connectionPromise();
    const players = db.$$collections.players;
    
    return new Promise((resolve, reject) => {
      players.insertOne(playerObject, (err) =>{
        if (!err) {
          resolve(playerObject);
        } else {
          // process.stdout.write('|');
          // TOFIX: for now, just dump these. it's failed, typically from high load. Hopefully the next save will work better
          // MONGOERRORIGNORE
        }
      }, reject);
    });
  }

  async savePlayer(playerObject) {
    const savePlayerObject = playerObject.buildSaveObject();
    const db = await this.dbWrapper.connectionPromise();
    const players = db.$$collections.players;

    return new Promise((resolve, reject) => {
      players.findOneAndUpdate({ _id: savePlayerObject._id }, savePlayerObject, { upsert: true }, (err) =>{
        if (!err) {
          resolve(playerObject);
        } else {
          // process.stdout.write('-');
          // TOFIX: for now, just dump these. it's failed, typically from high load. Hopefully the next save will work better
          // MONGOERRORIGNORE
        }
      }, reject);
    });
  }
}
