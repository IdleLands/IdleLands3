
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';
import { Logger } from '../../shared/logger';

export const event = 'plugin:gm:toggleachievement';
export const description = 'Mod only. Toggle a permanent achievement for the target.';
export const args = 'targetName, achievement';
export const socket = (socket) => {

  const toggleachievement = async({ targetName, achievement }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;
    Logger.info('Socket:GM:TogglePermanentAchievement', `${playerName} (${socket.address.ip}) giving achievement ${achievement} to ${targetName}.`);

    GMCommands.toggleAchievement(targetName, achievement);
  };

  socket.on(event, toggleachievement);
};