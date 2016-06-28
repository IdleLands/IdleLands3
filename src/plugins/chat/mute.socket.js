
import _ from 'lodash';

import { GameState } from '../../core/game-state';
import { SETTINGS } from '../../static/settings';

import { PlayerUpdateAll } from '../../shared/playerlist-updater';

export const event = 'plugin:chat:togglemute';
export const socket = (socket) => {

  const togglemute = async ({ playerName, targetName }) => {
    if(!socket.authToken) return;

    const player = GameState.retrievePlayer(playerName);
    const target = GameState.retrievePlayer(targetName);

    if(!player || !player.isMod || !target) return;
    target.isMuted = !target.isMuted;

    PlayerUpdateAll(targetName, ['isMuted']);
  };

  socket.on(event, togglemute);
};