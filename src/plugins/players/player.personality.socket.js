
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:togglepersonality';
export const socket = (socket) => {

  const togglepersonality = async({ playerName, personality }) => {
    const player = GameState.getInstance().getPlayer(playerName);
    player.togglePersonality(personality);
  };

  socket.on(event, togglepersonality);
};