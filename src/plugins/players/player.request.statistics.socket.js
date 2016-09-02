
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:request:statistics';
export const socket = (socket) => {

  const requeststatistics = async({ playerName }) => {
    if(!playerName) return;
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    player._updateStatistics();
  };

  socket.on(event, requeststatistics);
};