
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:player:tax';
export const description = 'Update your personal tax rate.';
export const args = 'newRate';
export const socket = (socket) => {

  const request = async({ newRate }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player) return;

    Logger.info('Socket:Guild:SelfTaxRate', `${playerName} (${socket.address.ip}) setting own tax rate to ${newRate}%.`);
    gameState.guilds.updatePersonalTaxRate(player, newRate);
  };

  socket.on(event, request);
};