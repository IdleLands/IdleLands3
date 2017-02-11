
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';
import { Logger } from '../../shared/logger';

export const event = 'plugin:gm:givegold';
export const description = 'Mod only. Give gold to a particular player.';
export const args = 'targetName, bonusGold';
export const socket = (socket) => {

  const givegold = async({ targetName, bonusGold }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;

    Logger.info('Socket:GM:GiveItem', `${playerName} (${socket.address.ip}) giving ${bonusGold} gold to ${targetName}.`);

    GMCommands.giveGold(targetName, bonusGold);
  };

  socket.on(event, givegold);
};