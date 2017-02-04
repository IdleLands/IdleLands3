
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:player:ascend';
export const description = 'Ascend.';
export const args = '';
export const socket = (socket) => {

  const ascend = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Player:Ascend', `${socket.playerName} ascended.`);
    
    player.ascend();
  };

  socket.on(event, ascend);
};