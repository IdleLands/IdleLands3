
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:invite';
export const description = 'Invite a new member to your guild.';
export const args = 'newMemberName';
export const socket = (socket, primus, respond) => {

  const request = async({ newMemberName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:Invite', `${playerName} (${socket.address.ip}) inviting ${newMemberName}.`);
    const message = gameState.guilds.inviteMember(player, newMemberName);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};