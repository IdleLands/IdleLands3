
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:takeitem';
export const description = 'Take an item from your pet and equip it.';
export const args = 'itemId';
export const socket = (socket, primus, respond) => {

  const pettakeitem = async({ itemId }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:Take', `${playerName} (${socket.address.ip}) taking ${itemId} from pet.`);

    const message = player.$pets.takeItemFromPet(player, itemId);

    if(message) {
      respond({ type: 'error', title: 'Pet Error', notify: message });
    }
  };

  socket.on(event, pettakeitem);
};