
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:leave';
export const description = 'Leave your guild.';
export const args = '';
export const socket = (socket, primus, respond) => {

  const request = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:Leave', `${playerName} (${socket.address.ip}) leaving guild.`);
    const message = gameState.guilds.leaveGuild(player);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};