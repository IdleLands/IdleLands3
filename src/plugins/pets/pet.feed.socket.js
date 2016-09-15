
import { GameState } from '../../core/game-state';

export const event = 'plugin:pet:feed';
export const description = 'Feed your pet gold.';
export const args = 'gold';
export const socket = (socket, primus, respond) => {

  const feed = async({ gold }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    
    const message = player.$pets.feedGold(player, gold);

    if(message) {
      respond({ type: 'error', title: 'Pet Error', notify: message });
    }
  };

  socket.on(event, feed);
};