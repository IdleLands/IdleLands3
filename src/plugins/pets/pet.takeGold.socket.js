
import { GameState } from '../../core/game-state';

export const event = 'plugin:pet:takegold';
export const description = 'Take your pets gold.';
export const args = '';
export const socket = (socket) => {

  const take = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    
    player.$pets.takePetGold(player);
  };

  socket.on(event, take);
};