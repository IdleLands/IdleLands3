
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:equip';
export const description = 'Equip an item from your pets inventory.';
export const args = 'itemId';
export const socket = (socket, primus, respond) => {

  const petequip = async({ itemId }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:Equip', `${playerName} (${socket.address.ip}) pet equipping ${itemId}.`);
    
    const message = player.$pets.equipPetItem(player, itemId);

    if(message) {
      respond({ type: 'error', title: 'Pet Error', notify: message });
    }
  };

  socket.on(event, petequip);
};