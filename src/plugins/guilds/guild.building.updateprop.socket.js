
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:building:updateprop';
export const description = 'Update a building property.';
export const args = 'buildingName, propName, propValue';
export const socket = (socket, primus, respond) => {

  const request = async({ buildingName, propName, propValue }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player || !player.guild || player.guild.$noGuild) return;

    Logger.info('Socket:Guild:Building:UpdateProp', `${playerName} (${socket.address.ip}) updating prop ${buildingName}-${propName} to ${propValue}.`);
    const message = gameState.guilds.updateProp(player, buildingName, propName, propValue);

    if(message) {
      respond({ type: 'error', title: 'Guild Error', notify: message });
    }
  };

  socket.on(event, request);
};