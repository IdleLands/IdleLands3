
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:invite:reject';
export const description = 'Reject a guild invitation.';
export const args = '';
export const socket = (socket, primus, respond) => {

  const request = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player) return;

    Logger.info('Socket:Guild:InviteReject', `${playerName} (${socket.address.ip}) rejecting guild invite.`);
    const message = gameState.guilds.inviteReject(player);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};