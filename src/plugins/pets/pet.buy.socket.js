
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:buy';
export const description = 'Buy a new pet.';
export const args = 'petType, petName';
export const socket = (socket) => {

  const buypet = async({ petType, petName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:Buy', `${playerName} (${socket.address.ip}) buying pet ${petType} and naming it ${petName}.`);

    player.$pets.addNewPet(player, petType, petName);
  };

  socket.on(event, buypet);
};