
import { addPlayer } from '../../shared/worker-wrapper';
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

    emitter.emit(event, player);
    const players = await addPlayer(worker, name);
    console.log('added', players);
  };

  socket.on('plugin:player:login', login);
};