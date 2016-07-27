
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:changename';
export const socket = (socket) => {

  const changename = async({ playerName, targetName, newName }) => {
    if(!socket.authToken) return;

    const gameState = GameState.getInstance();
    const player = gameState.retrievePlayer(playerName);
    const target = gameState.retrievePlayer(targetName);

    if(!player || !player.isMod || !target) return;
    player.changeName(newName);
  };

  socket.on(event, changename);
};