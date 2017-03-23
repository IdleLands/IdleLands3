
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:salvageall';
export const description = 'Salvage all items from your pets inventory.';
export const args = '';
export const socket = (socket, primus, respond) => {

  const petsell = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:SalvageAll', `${playerName} (${socket.address.ip}) pet salvaging all.`);
    
    const message = player.$pets.salvageAllPetItems(player);

    if(message) {
      respond({ type: 'whatever', title: 'Pet Message', notify: message });
    }
  };

  socket.on(event, petsell);
};