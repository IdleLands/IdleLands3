
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:togglepersonality';
export const socket = (socket) => {

  const togglepersonality = async({ personality }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    player.togglePersonality(personality);
  };

  socket.on(event, togglepersonality);
};