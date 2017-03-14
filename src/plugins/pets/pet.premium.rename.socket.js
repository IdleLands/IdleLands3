
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:rename';
export const description = 'Rename your pet. Requires 1 Rename Tag: Pet.';
export const args = 'petId, newName';
export const socket = (socket, primus, respond) => {

  const petrename = async({ petId, newName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:Rename', `${playerName} (${socket.address.ip}) changing pet ${petId} name to ${newName}`);
    
    const message = player.$pets.changePetName(player, petId, newName);
    if(message) {
      respond({ type: 'error', title: 'Pet Error', notify: message });
    }
  };

  socket.on(event, petrename);
};