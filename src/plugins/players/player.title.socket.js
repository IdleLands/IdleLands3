
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:changetitle';
export const description = 'Change your title.';
export const args = 'title';
export const socket = (socket) => {

  const changetitle = async({ title }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    
    player.changeTitle(title);
  };

  socket.on(event, changetitle);
};