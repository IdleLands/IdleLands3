
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:player:partyleave';
export const description = 'Leave your current party.';
export const args = '';
export const socket = (socket) => {

  const leaveparty = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.party) return;
    Logger.info('Socket:Player:PartyLeave', `${playerName} (${socket.address.ip}) leaving party.`);

    player.party.playerLeave(player);
  };

  socket.on(event, leaveparty);
};