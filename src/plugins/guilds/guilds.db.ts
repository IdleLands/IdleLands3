
import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';

@Dependencies(DbWrapper)
export class GuildsDb {

  dbWrapper: any;

  constructor(DbWrapper) {
    this.dbWrapper = DbWrapper;
  }

  async getGuilds(): Promise<any> {
    const db = await this.dbWrapper.connectionPromise();
    const guilds = db.$$collections.guilds;

    return new Promise((resolve, reject) => {
      guilds.find({}, (err, docs) => {

        if(err) {
          return reject({ err, msg: MESSAGES.GENERIC });
        }

        try {
          docs.toArray((err, data) => {
            resolve(data);
          });
        } catch(e) {
          Logger.error('GuildsDb:getGuilds', e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  }

  async createGuild(guildObject) {
    const db = await this.dbWrapper.connectionPromise();
    const guilds = db.$$collections.guilds;

    return new Promise((resolve, reject) => {
      guilds.insertOne(guildObject, (err) => {
        if(err) return reject(err);
        resolve(guildObject);
      });
    });
  }

  async saveGuild(guildObject) {
    const saveObject = guildObject.buildSaveObject();
    const db = await this.dbWrapper.connectionPromise();
    const guilds = db.$$collections.guilds;

    return new Promise((resolve, reject) => {
      guilds.findOneAndUpdate({ _id: saveObject._id }, saveObject, { upsert: true }, (err) => {

        if(err) {
          return reject(err);
        }

        resolve(guildObject);
      }, reject);
    });
  }
}
