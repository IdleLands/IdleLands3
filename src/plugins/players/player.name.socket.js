
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:changename';
export const socket = (socket) => {

  const changename = async({ targetName, newName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.retrievePlayer(playerName);
    const target = gameState.retrievePlayer(targetName);

    if(!player || !player.isMod || !target) return;
    target.changeName(newName);
  };

  socket.on(event, changename);
};