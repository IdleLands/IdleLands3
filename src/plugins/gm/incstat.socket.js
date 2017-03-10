
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';
import { Logger } from '../../shared/logger';

export const event = 'plugin:gm:setstat';
export const description = 'Mod only. Set a stat for a particular player.';
export const args = 'targetName, targetStat, targetValue';
export const socket = (socket) => {

  const setstat = async({ targetName, targetStat, targetValue }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod || !targetName || !targetStat || !targetValue) return;
    Logger.info('Socket:GM:SetStat', `${playerName} (${socket.address.ip}) setting ${targetStat} on ${targetName} to ${targetValue}.`);

    GMCommands.setStat(targetName, targetStat, targetValue);
  };

  socket.on(event, setstat);
};