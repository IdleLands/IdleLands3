
import { GameState } from '../../core/game-state';

import { PlayerUpdateAll } from '../../shared/playerlist-updater';

export const event = 'plugin:chat:togglemute';
export const socket = (socket) => {

  const togglemute = async ({ playerName, targetName }) => {
    if(!socket.authToken) return;

    const gameState = GameState.getInstance();
    const player = gameState.retrievePlayer(playerName);
    const target = gameState.retrievePlayer(targetName);

    if(!player || !player.isMod || !target) return;
    target.isMuted = !target.isMuted;

    PlayerUpdateAll(targetName, ['isMuted']);
  };

  socket.on(event, togglemute);
};