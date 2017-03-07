
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:player:changename';
export const description = 'Mod only. Change targets name to something else.';
export const args = 'targetName, newName';
export const socket = (socket) => {

  const changename = async({ targetName, newName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    const target = gameState.getPlayer(targetName);

    if(!player || !player.isMod || !target || !newName || !newName.trim()) return;
    Logger.info('Socket:Player:NameChange', `${socket.playerName} (${socket.address.ip}) changing player name from ${targetName} to ${newName}.`);

    target.changeName(newName);
  };

  socket.on(event, changename);
};