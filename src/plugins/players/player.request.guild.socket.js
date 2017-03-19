
import { GameState } from '../../core/game-state';
// import { Logger } from '../../shared/logger';

export const event = 'plugin:player:request:guild';
export const description = 'Request guild data.';
export const args = '';
export const socket = (socket) => {

  const requestguild = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    // Logger.info('Socket:Player:RequestPet', `${socket.playerName} (${socket.address.ip}) requesting pet.`);

    player._updateGuild();
  };

  socket.on(event, requestguild);
};