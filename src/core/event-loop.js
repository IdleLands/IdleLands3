
import _ from 'lodash';

import { Logger } from '../shared/logger';
import { GameState } from './game-state';
import { SETTINGS } from '../static/settings';

import { SomePlayersPostMove } from '../shared/playerlist-updater';

Logger.info('Core', 'Starting emitters.');
import './emitter-watchers';

Logger.info('Core', 'Loading assets.');
import '../shared/asset-loader';

Logger.info('Core', 'Loading events.');
import '../plugins/events/eventhandler';

Logger.info('Core', 'Creating game state.');
GameState.getInstance();

Logger.info('Core', 'Starting event loop.');

const timerDelay = SETTINGS.timeframeSeconds * (process.env.NODE_ENV === 'production' ? 200 : 1);

const flagNextTurn = (player) => {
  player.$nextTurn = Date.now() + ((process.env.NODE_ENV === 'production' ? 1000 : 10) * SETTINGS.timeframeSeconds);
};

const canTakeTurn = (now, player) => {
  return player.$nextTurn - now <= 0;
};

const playerInterval = () => {
  const gameState = GameState.getInstance();
  const players = gameState.getPlayers();

  const now = Date.now();

  const ranPlayerNames = {};

  const playerTakeTurn = (player) => {
    if(!player.$nextTurn) flagNextTurn(player);
    if(!canTakeTurn(now, player)) return;

    ranPlayerNames[player.name] = true;
    flagNextTurn(player);

    player.takeTurn();
    // PlayerUpdateAll(player.name, ['x', 'y', 'map']);
  };

  _.each(players, playerTakeTurn);

  SomePlayersPostMove(ranPlayerNames);
};

setInterval(playerInterval, timerDelay);