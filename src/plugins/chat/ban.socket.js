
import { GameState } from '../../core/game-state';

import { emitter } from '../../plugins/players/_emitter';

export const event = 'plugin:chat:toggleban';
export const socket = (socket) => {

  const toggleban = async ({ playerName, targetName }) => {
    if(!socket.authToken) return;

    const gameState = GameState.getInstance();
    const player = gameState.retrievePlayer(playerName);
    const target = gameState.retrievePlayer(targetName);

    if(!player || !player.isMod || !target) return;
    target.isBanned = true;
    target.save();

    emitter.emit('player:logout', { playerName: targetName });
  };

  socket.on(event, toggleban);
};