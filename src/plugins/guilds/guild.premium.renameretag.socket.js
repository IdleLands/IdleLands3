
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:renameretag';
export const description = 'Rename/retag from your guild.';
export const args = 'name, tag';
export const socket = (socket, primus, respond) => {

  const request = async({ name, tag }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:RenameRetag', `${playerName} (${socket.address.ip}) retagging guild ${name} [${tag}].`);
    const message = gameState.guilds.renameRetag(player, name, tag);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};