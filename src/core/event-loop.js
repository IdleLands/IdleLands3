
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

Logger.info('Redis', 'Connecting to Redis (if possible).');
import '../plugins/scaler/redis';

Logger.info('Core', 'Creating game state.');
GameState.getInstance();

Logger.info('Core', 'Starting event loop.');

const timerDelay = SETTINGS.timeframeSeconds * (process.env.NODE_ENV === 'production' ? 200 : 10);

const flagNextTurn = (player) => {
  player.$nextTurn = Date.now() + ((process.env.NODE_ENV === 'production' ? 1000 : 20) * SETTINGS.timeframeSeconds);
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

if(global.gc) {
  Logger.info('Core', 'Running GC every 30 seconds.');
  setInterval(global.gc, 30000);
}