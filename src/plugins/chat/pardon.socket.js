
import { GameState } from '../../core/game-state';

import { PlayerUpdateAll } from '../../shared/playerlist-updater';

export const event = 'plugin:chat:togglepardon';
export const description = 'Mod only. Toggle pardoned status for a particular user.';
export const args = 'targetName';
export const socket = (socket) => {

  const togglepardon = async ({ targetName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.retrievePlayer(playerName);
    const target = gameState.retrievePlayer(targetName);

    if(!player || !player.isMod || !target) return;
    target.isPardoned = !target.isPardoned;
    if(target.isPardoned && target.isMuted) target.isMuted = false;

    PlayerUpdateAll(target._id, ['isMuted', 'isPardoned']);
  };

  socket.on(event, togglepardon);
};