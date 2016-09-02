
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:request:achievements';
export const socket = (socket) => {

  const requestachievements = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    if(!playerName) return;
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    player._updateAchievements();
  };

  socket.on(event, requestachievements);
};