
import { DbWrapper } from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';

export const persistToDb = async (battleInstance) => {

  const saveData = battleInstance.saveObject();

  const db = await DbWrapper.promise;
  const battles = db.collection('battles');

  return new Promise((resolve, reject) => {
    battles.findOneAndUpdate({ _id: saveData.name }, saveData, { upsert: true }, (err) =>{
      if (!err) {
        resolve(saveData);
      } else {
        // process.stdout.write('b');
        // TOFIX: for now, just dump these. it's failed, typically from high load. Hopefully the next save will work better
        // MONGOERRORIGNORE
      }
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