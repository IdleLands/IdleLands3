
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:profession';
export const description = 'Change your pets profession.';
export const args = 'newProfession';
export const socket = (socket) => {

  const petclass = async({ newProfession }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:Profession', `${playerName} (${socket.address.ip}) pet profession change to ${newProfession}.`);
    
    player.$pets.changePetProfession(player, newProfession);
  };

  socket.on(event, petclass);
};