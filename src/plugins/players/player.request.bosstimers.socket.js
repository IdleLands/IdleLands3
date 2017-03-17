
import { GameState } from '../../core/game-state';
// import { Logger } from '../../shared/logger';

export const event = 'plugin:player:request:bosstimers';
export const description = 'Request bosstimer data. Generally used only when looking at maps.';
export const args = '';
export const socket = (socket) => {

  const requesttimers = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;

    player._updateBossTimers();
  };

  socket.on(event, requesttimers);
};