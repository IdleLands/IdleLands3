
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:building:build';
export const description = 'Build a building in the gruild.';
export const args = 'buildingName, slot';
export const socket = (socket, primus, respond) => {

  const request = async({ buildingName, slot }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:Building:Build', `${playerName} (${socket.address.ip}) building ${buildingName} in slot ${slot}.`);
    const message = gameState.guilds.buildBuilding(player, buildingName, slot);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};