
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';
import { Logger } from '../../shared/logger';

export const event = 'plugin:gm:teleport';
export const description = 'Mod only. Teleport a user to a location.';
export const args = 'targetName, teleData';
export const socket = (socket) => {

  const teleport = async({ targetName, teleData }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;
    Logger.info('Socket:GM:Teleport', `${playerName} (${socket.address.ip}) teleporting ${targetName} to ${JSON.stringify(teleData)}.`);

    const target = GameState.getInstance().getPlayer(targetName);
    GMCommands.teleport(target, teleData);
  };

  socket.on(event, teleport);
};