
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';

export const event = 'plugin:gm:toggleachievement';
export const description = 'Mod only. Toggle a permanent achievement for the target.';
export const args = 'targetName, achievement';
export const socket = (socket) => {

  const toggleachievement = async({ targetName, achievement }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player.isMod) return;

    const target = GameState.getInstance().getPlayer(targetName);
    GMCommands.toggleAchievement(target, achievement);
  };

  socket.on(event, toggleachievement);
};