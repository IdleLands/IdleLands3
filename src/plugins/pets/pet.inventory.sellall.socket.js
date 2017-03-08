
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:sellall';
export const description = 'Sell all items from your pets inventory.';
export const args = '';
export const socket = (socket) => {

  const petsellall = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:SellAll', `${playerName} (${socket.address.ip}) pet selling all.`);
    
    player.$pets.sellAllPetItems(player);
  };

  socket.on(event, petsellall);
};