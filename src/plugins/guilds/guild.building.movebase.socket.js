
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:building:movebase';
export const description = 'Move the guild to a new place.';
export const args = 'newBase';
export const socket = (socket, primus, respond) => {

  const request = async({ newBase }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:Building:MoveBase', `${playerName} (${socket.address.ip}) moving to ${newBase}.`);
    const message = gameState.guilds.moveBase(player, newBase);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};