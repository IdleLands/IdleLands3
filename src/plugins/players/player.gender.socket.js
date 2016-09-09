
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:changegender';
export const description = 'Change your gender based on the existing gender list.';
export const args = 'gender';
export const socket = (socket) => {

  const changegender = async({ gender }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    player.changeGender(gender);
  };

  socket.on(event, changegender);
};