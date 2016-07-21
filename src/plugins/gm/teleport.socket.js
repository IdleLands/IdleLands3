
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';

export const event = 'plugin:gm:teleport';
export const socket = (socket) => {

  const teleport = async({ targetName, teleData }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player.isMod) return;

    const target = GameState.getInstance().getPlayer(targetName);
    GMCommands.teleport(target, teleData);
  };

  socket.on(event, teleport);
};