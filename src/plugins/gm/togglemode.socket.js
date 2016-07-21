
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';

export const event = 'plugin:gm:togglemod';
export const socket = (socket) => {

  const togglemod = async({ targetName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player.isMod) return;

    const target = GameState.getInstance().getPlayer(targetName);
    GMCommands.toggleMod(target);
  };

  socket.on(event, togglemod);
};