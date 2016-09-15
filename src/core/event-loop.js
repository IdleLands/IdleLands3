
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

const timerDelay = SETTINGS.timeframeSeconds * (process.env.NODE_ENV === 'production' ? 200 : 5);

const flagNextTurn = (player) => {
  player.$nextTurn = Date.now() + (1000 * SETTINGS.timeframeSeconds);
};

const canTakeTurn = (now, player) => {
  return player.$nextTurn - now <= 0;
};

setInterval(() => {
  const gameState = GameState.getInstance();
  const players = gameState.getPlayers();

  const now = Date.now();

  const ranPlayerNames = {};

  _.each(players, player => {
    if(!player.$nextTurn) flagNextTurn(player);
    if(!canTakeTurn(now, player)) return;

    ranPlayerNames[player.name] = true;
    flagNextTurn(player);

    player.takeTurn();
      // PlayerUpdateAll(player.name, ['x', 'y', 'map']);
  });

  SomePlayersPostMove(ranPlayerNames);

  /*
  const promises = _.map(players, (player) => {
    const playerName = player.name;

    return new Promise(resolve => {
      // setTimeout(() => {

      if(!_.find(gameState.getPlayers(), { name: playerName })) return resolve(false);
      player.takeTurn();
      resolve(true);

      // }, index * (timerDelay / players.length));
    });

  });

  Promise.all(promises).then(AllPlayersPostMove);
  */

}, timerDelay);