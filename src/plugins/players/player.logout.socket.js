
import { emitter } from './_emitter';
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:player:logout';
export const description = 'Log out of the game.';
export const args = '';
export const socket = (socket, primus) => {

  const logout = async () => {
    if(!socket.authToken) return;
    const { playerName } = socket.authToken;
    Logger.info('Socket:Player:Logout', `${playerName} (${socket.address.ip}) logging out.`);

    const gameState = GameState.getInstance();

    const timeoutId = setTimeout(() => {
      if(!gameState._hasTimeout(playerName)) return;
      gameState._clearTimeout(playerName);
      primus.delPlayer(playerName, socket);
      emitter.emit('player:logout', { playerName });
    }, 10000);

    gameState._setTimeout(playerName, timeoutId);

  };

  socket.on('close', logout);
  socket.on('end', logout);
  socket.on(event, logout);
};