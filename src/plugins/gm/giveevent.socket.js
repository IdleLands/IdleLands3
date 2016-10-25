
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';
import { Logger } from '../../shared/logger';

export const event = 'plugin:gm:giveevent';
export const description = 'Mod only. Give an event to a particular player.';
export const args = 'targetName, targetEvent';
export const socket = (socket) => {

  const setlevel = async({ targetName, targetEvent }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;
    Logger.info('Socket:GM:GiveEvent', `${playerName} (${socket.address.ip}) giving event ${targetEvent} to ${targetName}.`);

    const target = GameState.getInstance().getPlayer(targetName);
    GMCommands.giveEvent(target, targetEvent);
  };

  socket.on(event, setlevel);
};