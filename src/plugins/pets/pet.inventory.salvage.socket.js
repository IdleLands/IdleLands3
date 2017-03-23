
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:salvage';
export const description = 'Salvage an item from your pets inventory.';
export const args = 'itemId';
export const socket = (socket, primus, respond) => {

  const petsell = async({ itemId }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:Salvage', `${playerName} (${socket.address.ip}) pet salvaging ${itemId}.`);
    
    const message = player.$pets.salvagePetItem(player, itemId);

    if(message) {
      respond({ type: 'whatever', title: 'Pet Message', notify: message });
    }
  };

  socket.on(event, petsell);
};