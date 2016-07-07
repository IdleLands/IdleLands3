
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:changetitle';
export const socket = (socket) => {

  const changetitle = async({ playerName, title }) => {
    const player = GameState.getInstance().getPlayer(playerName);
    player.changeTitle(title);
  };

  socket.on(event, changetitle);
};