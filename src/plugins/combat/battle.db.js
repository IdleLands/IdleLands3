
import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';

export const persistToDb = async (battleInstance) => {

  const saveData = battleInstance.saveObject();

  const db = await DbWrapper.promise;
  const battles = db.collection('battles');

  return new Promise((resolve, reject) => {
    battles.findOneAndUpdate({ _id: saveData._id }, saveData, { upsert: true }).then(() => {
      resolve(saveData);
    }, reject);
  });
};

export const retrieveFromDb = async (battleName) => {

  const db = await DbWrapper.promise;
  const battles = db.collection('battles');

  return new Promise((resolve, reject) => {
    battles.find({ _id: battleName }).limit(1).next(async(err, doc) => {
      if(err) {
        return reject({ err, msg: MESSAGES.GENERIC });
      }

      if(!doc) {
        return reject({ err, msg: MESSAGES.NO_BATTLE });
      }

      resolve(doc);
    });
  });
};