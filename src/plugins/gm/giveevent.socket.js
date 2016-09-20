
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';

export const event = 'plugin:gm:giveevent';
export const description = 'Mod only. Give an event to a particular player.';
export const args = 'targetName, targetEvent';
export const socket = (socket) => {

  const setlevel = async({ targetName, targetEvent }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;

    const target = GameState.getInstance().getPlayer(targetName);
    GMCommands.giveEvent(target, targetEvent);
  };

  socket.on(event, setlevel);
};