
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:feedmax';
export const description = 'Feed your pet maximum gold.';
export const args = '';
export const socket = (socket, primus, respond) => {

  const feed = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:FeedMax', `${playerName} (${socket.address.ip}) feeding pet MAX.`);
    
    const message = player.$pets.feedMax(player);

    if(message) {
      respond({ type: 'error', title: 'Pet Error', notify: message });
    }
  };

  socket.on(event, feed);
};