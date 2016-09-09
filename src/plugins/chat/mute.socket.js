
import { GameState } from '../../core/game-state';

import { PlayerUpdateAll } from '../../shared/playerlist-updater';

export const event = 'plugin:chat:togglemute';
export const description = 'Mod only. Toggle muted status for a particular user.';
export const args = 'targetName';
export const socket = (socket) => {

  const togglemute = async ({ targetName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.retrievePlayer(playerName);
    const target = gameState.retrievePlayer(targetName);

    if(!player || !player.isMod || !target) return;
    target.isMuted = !target.isMuted;

    PlayerUpdateAll(target._id, ['isMuted']);
  };

  socket.on(event, togglemute);
};