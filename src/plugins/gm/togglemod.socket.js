
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

    const target = GameState.getInstance().getPlayer(targetName);
    Logger.info('Socket:GM:ToggleMod', `${playerName} (${socket.address.ip}) ${target.isMod ? 'taking' : 'giving'} mod to ${targetName}.`);

    GMCommands.toggleMod(target);
  };

  socket.on(event, togglemod);
};