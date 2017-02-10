
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';
import { Logger } from '../../shared/logger';

export const event = 'plugin:gm:setlevel';
export const description = 'Mod only. Set a players level.';
export const args = 'targetName, targetLevel';
export const socket = (socket) => {

  const setlevel = async({ targetName, targetLevel }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;
    Logger.info('Socket:GM:SetLevel', `${playerName} (${socket.address.ip}) setting level ${targetLevel} on ${targetName}.`);

    GMCommands.setLevel(targetName, targetLevel);
  };

  socket.on(event, setlevel);
};