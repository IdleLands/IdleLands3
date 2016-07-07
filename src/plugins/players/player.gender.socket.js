
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:changegender';
export const socket = (socket) => {

  const changegender = async({ playerName, gender }) => {
    const player = GameState.getInstance().getPlayer(playerName);
    player.changeGender(gender);
  };

  socket.on(event, changegender);
};