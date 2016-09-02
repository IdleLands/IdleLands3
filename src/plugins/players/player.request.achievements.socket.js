
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:request:achievements';
export const socket = (socket) => {

  const requestachievements = async({ playerName }) => {
    if(!playerName) return;
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    player._updateAchievements();
  };

  socket.on(event, requestachievements);
};