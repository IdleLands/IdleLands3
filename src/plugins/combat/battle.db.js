
import _ from 'lodash';
import { DbWrapper } from '../../shared/db-wrapper';

export const persistToDb = async (battleInstance) => {
  const saveData = {
    name: battleInstance.name,
    happenedAt: Date.now(),
    messageData: battleInstance.messageData,
    parties: _.map(battleInstance.parties, party => party.buildTransmitObject())
  };

  const db = await DbWrapper.promise;
  const battles = db.collection('battles');

  return new Promise((resolve, reject) => {
    battles.findOneAndUpdate({ _id: saveData.name }, saveData, { upsert: true }).then(() => {
      resolve(saveData);
    }, reject);
  });
};