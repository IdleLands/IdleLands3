
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:motd';
export const description = 'Update your guilds MOTD.';
export const args = 'motd';
export const socket = (socket, primus, respond) => {

  const request = async({ motd }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:MOTD', `${playerName} (${socket.address.ip}) changing guild MOTD to ${motd}%.`);
    const message = gameState.guilds.changeMOTD(player, motd);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};