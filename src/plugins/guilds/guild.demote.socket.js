
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:demote';
export const description = 'Demote a member to member status.';
export const args = 'memberName';
export const socket = (socket, primus, respond) => {

  const request = async({ memberName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:Demote', `${playerName} (${socket.address.ip}) demoting ${memberName}.`);
    const message = gameState.guilds.demoteMember(player, memberName);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};