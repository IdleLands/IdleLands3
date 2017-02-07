
import { GameState } from '../../core/game-state';
import { GMCommands } from '../gm/commands';
import { Logger } from '../../shared/logger';

export const event = 'plugin:festival:cancel';
export const description = 'Mod only. Cancel a festival.';
export const args = 'festivalId';
export const socket = (socket, primus, respond) => {

  const cancelfestival = async({ festivalId }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;

    if(!festivalId) {
      return respond({ type: 'error', notify: 'Invalid festival.' });
    }

    Logger.info('Socket:GM:CancelFestival', `${playerName} (${socket.address.ip}) cancelling festival "${festivalId}".`);

    GMCommands.cancelFestival(festivalId);
    player.update();
  };

  socket.on(event, cancelfestival);
};