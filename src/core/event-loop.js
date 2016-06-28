
import _ from 'lodash';

import { Logger } from '../shared/logger';
import { GameState } from './game-state';
import { SETTINGS } from '../static/settings';

import { AllPlayersPostMove } from '../shared/playerlist-updater';

Logger.info('Core', 'Starting emitters.');

import './emitter-watchers';

Logger.info('Core', 'Starting event loop.');

const timerDelay = SETTINGS.timeframeSeconds * (process.env.NODE_ENV === 'production' ? 1000 : 1);

setInterval(() => {
  const players = GameState.getPlayers();
  const promises = _.map(players, (player, index) => {
    const playerName = player.name;

    return new Promise(resolve => {
      setTimeout(() => {

        if(!_.find(GameState.getPlayers(), { name: playerName })) return resolve(false);
        player.takeTurn();
        resolve(true);

      }, index * (timerDelay / players.length));
    });

  });

  Promise.all(promises).then(AllPlayersPostMove);

}, timerDelay);