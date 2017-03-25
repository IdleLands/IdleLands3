
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:building:upgrade';
export const description = 'Upgrade a building in the guild.';
export const args = 'buildingName';
export const socket = (socket, primus, respond) => {

  const request = async({ buildingName }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:Building:Build', `${playerName} (${socket.address.ip}) upgrading ${buildingName}.`);
    const message = gameState.guilds.upgradeBuilding(player, buildingName);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};