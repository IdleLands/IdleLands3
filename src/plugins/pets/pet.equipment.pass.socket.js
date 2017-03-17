
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:pass';
export const description = 'Pass an item from your pets inventory to another pet.';
export const args = 'itemId, petId';
export const socket = (socket, primus, respond) => {

  const petpass = async({ itemId, petId }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:Pass', `${playerName} (${socket.address.ip}) pet passing ${itemId} to ${petId}.`);
    
    const message = player.$pets.passPetItem(player, itemId, petId);

    if(message) {
      respond({ type: 'error', title: 'Pet Error', notify: message });
    }
  };

  socket.on(event, petpass);
};