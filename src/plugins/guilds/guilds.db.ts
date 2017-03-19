
import * as _ from 'lodash';

import { Dependencies } from 'constitute';

import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';
import { Logger } from '../../shared/logger';

import { constitute } from '../../shared/di-wrapper';

import { Guild } from './guild';

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
            const guildObj = {};

            _.each(data, guild => {
              const guildCont = constitute(Guild);
              guildCont.init(guild);

              guildObj[guildCont.name] = guildCont;
            });

            resolve(guildObj);
          });
        } catch(e) {
          Logger.error('GuildsDb:getGuilds', e);
          reject({ e, msg: MESSAGES.GENERIC });
        }
      });
    });
  }

  async removePlayerFromGuild(playerName) {
    const db = await this.dbWrapper.connectionPromise();
    const players = db.$$collections.players;

    return new Promise((resolve, reject) => {
      players.findOneAndUpdate({ _id: playerName }, { $set: { guildName: '' } }, (err) => {

        if(err) {
          return reject(err);
        }

        resolve();
      }, reject);
    });
  }

  async removeGuild(guildObject) {
    const db = await this.dbWrapper.connectionPromise();
    const guilds = db.$$collections.guilds;

    return new Promise((resolve, reject) => {
      guilds.remove({ _id: guildObject._id }, (err) => {

        if(err) {
          return reject(err);
        }

        resolve(guildObject);
      }, reject);
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
