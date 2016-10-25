
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:attr';
export const description = 'Change your pets attribute.';
export const args = 'newAttr';
export const socket = (socket) => {

  const petattr = async({ newAttr }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:AttributeChange', `${playerName} (${socket.address.ip}) changing pet attribute to ${newAttr}`);
    
    player.$pets.changePetAttr(player, newAttr);
  };

  socket.on(event, petattr);
};