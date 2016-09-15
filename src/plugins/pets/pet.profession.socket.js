
import { GameState } from '../../core/game-state';

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
    
    player.$pets.changePetProfession(player, newProfession);
  };

  socket.on(event, petclass);
};