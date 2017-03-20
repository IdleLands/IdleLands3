
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:guild:donate';
export const description = 'Donate to your guild.';
export const args = 'gold';
export const socket = (socket) => {

  const request = async({ gold }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const gameState = GameState.getInstance();
    const player = gameState.getPlayer(playerName);
    if(!player) return;

    Logger.info('Socket:Guild:Donate', `${playerName} (${socket.address.ip}) donating ${gold} gold.`);
    gameState.guilds.donateGold(player, gold);
  };

  socket.on(event, request);
};