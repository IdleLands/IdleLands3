
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:player:makechoice';
export const description = 'Make a choice from the choice log.';
export const args = 'id, response';
export const socket = (socket) => {

  const makechoice = async({ id, response }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if (!player) return;
    Logger.info('Socket:Player:Choice', `${playerName} (${socket.address.ip}) choosing ${response} for ${id}.`);

    player.handleChoice({ id, response });
  };

  socket.on(event, makechoice);
};