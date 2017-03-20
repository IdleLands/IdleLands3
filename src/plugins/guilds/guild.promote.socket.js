
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:promote';
export const description = 'Promote a member to Mod status.';
export const args = 'memberName';
export const socket = (socket, primus, respond) => {

  const request = async({ memberName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:Promote', `${playerName} (${socket.address.ip}) promoting ${memberName}.`);
    const message = gameState.guilds.promoteMember(player, memberName);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};