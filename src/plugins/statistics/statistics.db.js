
import _ from 'lodash';

import dbPromise from '../../shared/db-wrapper';
import { MESSAGES } from '../../static/messages';

import { Statistics } from './statistics';

export const getStatistics = async (id) => {
  const db = await dbPromise();
  const statistics = db.collection('statistics');

  return new Promise((resolve, reject) => {
    statistics.find({ _id: id }).limit(1).next((err, doc) => {

      if (err) {
        return reject({ err, msg: MESSAGES.GENERIC });
      }

      resolve(new Statistics(doc));
    });
  });
};

export const saveStatistics = async (statsObject) => {
  const db = await dbPromise();
  const statistics = db.collection('statistics');

  return new Promise((resolve) => {
    statistics.findOneAndUpdate({ _id: statsObject._id }, statsObject, { upsert: true }).then((doc) => {
      resolve(new Statistics(doc.value));
    });
  });
};