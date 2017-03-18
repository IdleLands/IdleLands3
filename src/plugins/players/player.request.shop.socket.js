
import { GameState } from '../../core/game-state';
// import { Logger } from '../../shared/logger';

export const event = 'plugin:player:request:shop';
export const description = 'Request shop data. Generally used only when looking at shop data.';
export const args = '';
export const socket = (socket) => {

  const requestshop = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;

    player._updateShop();
  };

  socket.on(event, requestshop);
};