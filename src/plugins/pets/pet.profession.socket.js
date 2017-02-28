
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:profession';
export const description = 'Change your pets profession.';
export const args = 'newProfession';
export const socket = (socket, primus, respond) => {

  const petclass = async({ newProfession }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:Profession', `${playerName} (${socket.address.ip}) pet profession change to ${newProfession}.`);
    
    const res = player.$pets.changePetProfession(player, newProfession);
    if(res) {
      respond({ type: 'error', title: 'Pet Error', notify: res });
    }
  };

  socket.on(event, petclass);
};