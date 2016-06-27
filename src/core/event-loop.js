
import _ from 'lodash';

import { Logger } from '../shared/logger';
import { GameState } from './game-state';
import { SETTINGS } from '../static/settings';

Logger.info('Core', 'Starting emitters.');

import './emitter-watchers';

Logger.info('Core', 'Starting event loop.');

const timerDelay = SETTINGS.timeframeSeconds * (process.env.NODE_ENV === 'production' ? 1000 : 1);

setInterval(() => {
  const players = GameState.getPlayers();
  _.each(players, (player, index) => {
    const playerName = player.name;

    setTimeout(() => {

      if(!_.find(GameState.getPlayers(), { name: playerName })) return;
      player.takeTurn();

    }, index * (timerDelay / players.length));

  });
}, timerDelay);