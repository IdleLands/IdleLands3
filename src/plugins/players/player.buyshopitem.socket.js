
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:player:buyshopitem';
export const description = 'Buy an item from the shop.';
export const args = 'itemId';
export const socket = (socket, primus, respond) => {

  const buyshopitem = async({ itemId }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);

    if(!player || !itemId) return;
    Logger.info('Socket:Player:BuyShopItem', `${socket.playerName} (${socket.address.ip}) buying shop item ${itemId}.`);

    const message = player.buyShopItem(itemId);
    if(message) {
      respond({ type: 'error', title: 'Buy Error', notify: message });
    }
  };

  socket.on(event, buyshopitem);
};