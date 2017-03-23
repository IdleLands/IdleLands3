
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:sellall';
export const description = 'Sell all items from your pets inventory.';
export const args = '';
export const socket = (socket, primus, respond) => {

  const petsellall = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:SellAll', `${playerName} (${socket.address.ip}) pet selling all.`);
    
    const message = player.$pets.sellAllPetItems(player);

    if(message) {
      respond({ type: 'success', title: 'Pet Message', notify: message });
    }
  };

  socket.on(event, petsellall);
};