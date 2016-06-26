
import dbPromise from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';

export const getPlayer = async (opts) => {
  const db = await dbPromise();
  const players = db.collection('players');

  return new Promise((resolve, reject) => {
    players.find(opts).limit(1).next(async (err, doc) => {

      if(err) {
        return reject({ err, msg: MESSAGES.GENERIC });
      }

      if(!doc) {
        return reject({ err, msg: MESSAGES.NO_PLAYER });
      }

      resolve(doc);
    });
  });
};

export const createPlayer = async (playerObject) => {
  const db = await dbPromise();
  const players = db.collection('players');

  return new Promise((resolve, reject) => {
    players.insertOne(playerObject).then(() => {
      resolve(playerObject);
    }, reject);
  });
};

export const savePlayer = async (player) => {
  const savePlayerObject = player.buildSaveObject();
  const db = await dbPromise();
  const players = db.collection('players');

  return new Promise((resolve, reject) => {
    players.findOneAndUpdate({ _id: savePlayerObject._id }, savePlayerObject, { upsert: true }).then(() => {
      resolve(player);
    }, reject);
  });
};