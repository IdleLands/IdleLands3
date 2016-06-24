
import _ from 'lodash';

import dbPromise from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';

import { Player } from './player';

export const getPlayer = async (name) => {
  const db = await dbPromise();
  const players = db.collection('players');

  return new Promise((resolve, reject) => {
    players.find({ name }).limit(1).next((err, doc) => {

      if (err) {
        return reject({ err, msg: MESSAGES.GENERIC });
      }

      if (!doc) {
        return reject({ err, msg: MESSAGES.NO_PLAYER });
      }

      resolve(new Player(doc));
    });
  });
};

export const savePlayer = async (playerObject) => {
  const savePlayerObject = _.omitBy(playerObject, (val, key) => _.startsWith(key, '$'));
  const db = await dbPromise();
  const players = db.collection('players');

  return new Promise((resolve) => {
    players.findOneAndUpdate({ name: savePlayerObject.name }, savePlayerObject, { upsert: true }).then(() => {
      resolve(playerObject);
    });
  });
};