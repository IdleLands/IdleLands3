
import _ from 'lodash';
import Logger from '../../shared/logger';

export const addPlayer = (worker, player) => {
  return new Promise((resolve, reject) => {

    worker.exchange.get('players', (e, data) => {
      if(e) return Logger.error('{Worker:AddPlayer:Get}', e);
      if(_.includes(data, player)) return reject();

      worker.exchange.add('players', player, e => {
        if(e) return Logger.error('{Worker:AddPlayer:Add}', e);

        worker.exchange.get('players', (e, data) => {
          if(e) return Logger.error('{Worker:AddPlayer:Get}', e);

          resolve(data);
        });
      });
    });
  });
};

export const removePlayer = (worker, player) => {
  return new Promise(resolve => {
    worker.exchange.get('players', (e, data) => {
      if(e) return Logger.error('{Worker:AddPlayer:Get}', e);

      const index = _.find(data, player);

      worker.exchange.splice('players', { index, count: 1 });

      resolve();
    });
  });
};