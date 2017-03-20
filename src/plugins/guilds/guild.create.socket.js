
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:create';
export const description = 'Create a new guild.';
export const args = 'name, tag';
export const socket = (socket, primus, respond) => {

  const request = async({ name, tag }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player) return;

    Logger.info('Socket:Guild:Create', `${playerName} (${socket.address.ip}) creating guild ${name} [${tag}].`);
    const message = gameState.guilds.createGuild({ leader: player, name, tag });

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};