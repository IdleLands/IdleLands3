
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';

export const event = 'plugin:gm:setlevel';
export const description = 'Mod only. Set a players level.';
export const args = 'targetName, targetLevel';
export const socket = (socket) => {

  const setlevel = async({ targetName, targetLevel }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;

    const target = GameState.getInstance().getPlayer(targetName);
    GMCommands.setLevel(target, targetLevel);
  };

  socket.on(event, setlevel);
};