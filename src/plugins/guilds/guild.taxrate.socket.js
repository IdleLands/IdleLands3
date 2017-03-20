
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:tax';
export const description = 'Update your guilds tax rate.';
export const args = 'newRate';
export const socket = (socket) => {

  const request = async({ newRate }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player) return;

    Logger.info('Socket:Guild:TaxRate', `${playerName} (${socket.address.ip}) setting guild tax rate to ${newRate}%.`);
    gameState.guilds.updateGuildTaxRate(player, newRate);
  };

  socket.on(event, request);
};