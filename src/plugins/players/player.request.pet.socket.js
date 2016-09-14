
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:request:pets';
export const description = 'Request pet data.';
export const args = '';
export const socket = (socket) => {

  const requestpet = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    player._updatePet();
  };

  socket.on(event, requestpet);
};