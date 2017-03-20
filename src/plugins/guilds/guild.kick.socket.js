
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:kick';
export const description = 'Kick someone from your guild.';
export const args = 'memberName';
export const socket = (socket, primus, respond) => {

  const request = async({ memberName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:Kick', `${playerName} (${socket.address.ip}) kicking ${memberName}.`);
    const message = gameState.guilds.kickMember(player, memberName);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};