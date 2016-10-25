
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

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
    Logger.info('Socket:Pet:Sell', `${playerName} (${socket.address.ip}) pet selling ${itemId}.`);
    
    player.$pets.sellPetItem(player, itemId);
  };

  socket.on(event, petsell);
};