
import { emitter } from './_emitter';
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:logout';
export const socket = (socket) => {

  const logout = async () => {
    if(!socket.authToken) return;
    const { playerName } = socket.authToken;

    const gameState = GameState.getInstance();

    const timeoutId = setTimeout(() => {
      if(!gameState._hasTimeout(playerName)) return;
      gameState._clearTimeout(playerName);
      emitter.emit('player:logout', { playerName });
    }, 10000);

    gameState._setTimeout(playerName, timeoutId);

  };

  socket.on('close', logout);
  socket.on('end', logout);
  socket.on(event, logout);
};