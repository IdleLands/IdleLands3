
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';
import { Logger } from '../../shared/logger';

export const event = 'plugin:gm:togglemod';
export const description = 'Mod only. Toggle moderator status for the target.';
export const args = 'targetName';
export const socket = (socket) => {

  const togglemod = async({ targetName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;

    Logger.info('Socket:GM:ToggleMod', `${playerName} (${socket.address.ip}) toggling mod for ${targetName}.`);

    GMCommands.toggleMod(targetName);
  };

  socket.on(event, togglemod);
};