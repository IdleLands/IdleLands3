
import { GameState } from '../../core/game-state';

import { emitter } from '../../plugins/players/_emitter';

export const event = 'plugin:chat:toggleban';
export const description = 'Mod only. Toggle banned status for a particular user. Generally only used to ban, as they get kicked immediately.';
export const args = 'targetName';
export const socket = (socket) => {

  const toggleban = async ({ targetName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.retrievePlayer(playerName);
    const target = gameState.retrievePlayer(targetName);

    if(!player || !player.isMod || !target) return;
    target.isBanned = true;
    target._saveSelf();

    emitter.emit('player:logout', { playerName: targetName });
  };

  socket.on(event, toggleban);
};