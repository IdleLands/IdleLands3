
import { GameState } from '../../core/game-state';
// import { Logger } from '../../shared/logger';

export const event = 'plugin:player:request:personalities';
export const description = 'Request personality data. Generally used only when looking at personalities.';
export const args = '';
export const socket = (socket) => {

  const requestpersonalities = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    // Logger.info('Socket:Player:RequestPersonalities', `${socket.playerName} (${socket.address.ip}) requesting personalities.`);

    player._updatePersonalities();
  };

  socket.on(event, requestpersonalities);
};