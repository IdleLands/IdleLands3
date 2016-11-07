
import { GameState } from '../../core/game-state';
// import { Logger } from '../../shared/logger';

export const event = 'plugin:player:request:collectibles';
export const description = 'Request collectible data. Generally used only when looking at collectibles.';
export const args = '';
export const socket = (socket) => {

  const requestcollectibles = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    // Logger.info('Socket:Player:RequestCollectibles', `${socket.playerName} (${socket.address.ip}) requesting collectibles.`);

    player._updateCollectibles();
  };

  socket.on(event, requestcollectibles);
};