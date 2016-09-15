
import { GameState } from '../../core/game-state';

export const event = 'plugin:pet:sell';
export const description = 'Sell an item from your pets inventory.';
export const args = 'itemId';
export const socket = (socket) => {

  const petsell = async({ itemId }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    
    player.$pets.sellPetItem(player, itemId);
  };

  socket.on(event, petsell);
};