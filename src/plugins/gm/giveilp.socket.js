
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';
import { Logger } from '../../shared/logger';

export const event = 'plugin:gm:giveilp';
export const description = 'Mod only. Give ILP to a particular player.';
export const args = 'targetName, bonusIlp';
export const socket = (socket) => {

  const giveilp = async({ targetName, bonusIlp }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;

    Logger.info('Socket:GM:GiveItem', `${playerName} (${socket.address.ip}) giving ${bonusIlp} ILP to ${targetName}.`);

    GMCommands.giveILP(targetName, bonusIlp);
  };

  socket.on(event, giveilp);
};