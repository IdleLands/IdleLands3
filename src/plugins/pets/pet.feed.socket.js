
import { GameState } from '../../core/game-state';

export const event = 'plugin:pet:feed';
export const description = 'Feed your pet gold.';
export const args = 'gold';
export const socket = (socket) => {

  const feed = async({ gold }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);

    player.$pets.feedGold(player, gold);
  };

  socket.on(event, feed);
};