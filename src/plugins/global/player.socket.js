
import { GameState } from '../../core/game-state';

export const event = 'plugin:global:player';
export const description = 'Get all player information for the global page display. Cannot be logged in to execute this function.';
export const args = '';
export const socket = (socket, primus, respond) => {

  const player = async ({ playerName }) => {
    if(socket.authToken) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return respond({ update: 'player', data: {} });

    const data = {
      overview: player.buildTransmitObject(),
      equipment: player.equipment,
      statistics: player.$statistics.stats,
      achievements: player.$achievements.achievements,
      collectibles: player.$collectibles.collectibles
    };

    respond({
      update: 'player',
      data
    });

  };

  socket.on(event, player);
};