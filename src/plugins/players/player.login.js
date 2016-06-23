
import { addPlayer } from './player.worker';
import { getPlayer, savePlayer } from './player.db';

import { Player } from './player';
import { emitter } from './_emitter';

export const socket = (socket, worker) => {

  const login = async ({ name }) => {
    let player = null;
    let event = '';

    try {
      player = await getPlayer(name);
      event = 'player:login';

    } catch(e) {
      player = await savePlayer(new Player({ name }));
      event = 'player:register';
    }

    try {
      const players = await addPlayer(worker, name);
      console.log('added', players);

      socket.setAuthToken({ playerName: name });
      emitter.emit(event, player);
    } catch(e) {
      console.log('already logged in');
      socket.disconnect();
    }
  };

  socket.on('plugin:player:login', login);
};