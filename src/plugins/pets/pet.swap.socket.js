
import { GameState } from '../../core/game-state';

export const event = 'plugin:pet:swap';
export const description = 'Swap to a different pet.';
export const args = 'petType';
export const socket = (socket) => {

  const swappet = async({ petType }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);

    player.$pets.changePet(player, petType);
  };

  socket.on(event, swappet);
};