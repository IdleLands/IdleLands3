
import { GameState } from '../../core/game-state';
// import { Logger } from '../../shared/logger';

export const event = 'plugin:player:request:guildbuildings';
export const description = 'Request guild buildings data.';
export const args = '';
export const socket = (socket) => {

  const requestguildbuildings = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;

    player._updateGuildBuildings();
  };

  socket.on(event, requestguildbuildings);
};