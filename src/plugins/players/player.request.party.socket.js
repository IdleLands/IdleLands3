
import { GameState } from '../../core/game-state';
// import { Logger } from '../../shared/logger';

export const event = 'plugin:player:request:party';
export const description = 'Request party data. Generally used only when looking at overview.';
export const args = '';
export const socket = (socket) => {

  const requestparty = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    // Logger.info('Socket:Player:RequestParty', `${socket.playerName} (${socket.address.ip}) requesting party.`);

    player._updateParty();
  };

  socket.on(event, requestparty);
};