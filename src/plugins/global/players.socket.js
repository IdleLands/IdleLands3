
import { GameState } from '../../core/game-state';


export const event = 'plugin:global:allplayers';
export const description = 'Get all players for the global page display. Cannot be logged in to execute this function.';
export const args = '';
export const socket = (socket, primus, respond) => {

  const allplayers = async () => {
    if(socket.authToken) return;

    respond({
      update: 'onlineUsers',
      data: GameState.getInstance().getPlayersSimple(
        ['name', 'level', 'professionName', 'nameEdit', 'map'],
        true)
    });
  };

  socket.on(event, allplayers);
};