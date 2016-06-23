
import _ from 'lodash';

import { Logger } from '../shared/logger';
import { GameState } from './game-state';
import { SETTINGS } from '../static/settings';

Logger.info('Core', 'Starting emitters.');

import './emitter-watchers';

Logger.info('Core', 'Starting event loop.');

const timerDelay = SETTINGS.TimeframeSeconds * 1000;

setInterval(() => {
  _.each(GameState.players, (player, index) => {
    const playerName = player.name;

    setTimeout(() => {

      if(!_.find(GameState.players, { name: playerName })) return;
      player.takeTurn();

    }, index * (timerDelay / GameState.players.length));

  });
}, timerDelay);