
import _ from 'lodash';
import { addPlayer } from './player.worker';
import { getPlayer, savePlayer } from './player.db';

import { Player } from './player';
import { emitter } from './_emitter';

export const socket = (socket, worker) => {

  const login = async ({ name, gender, professionName }) => {
    let player = null;
    let event = '';

    try {
      player = await getPlayer(name);
      event = 'player:login';

    } catch(e) {

      // 20 char name is reasonable
      name = _.truncate(name, { length: 20 });

      // sensible defaults
      if(!_.includes(['male', 'female'], gender)) gender = 'male';
      if(!_.includes(['Generalist', 'Mage', 'Cleric', 'Fighter'], professionName)) professionName = 'Generalist';

      player = await savePlayer(new Player({ name, gender, professionName }));
      event = 'player:register';
    }

    try {
      await addPlayer(worker, name);
      socket.setAuthToken({ playerName: name });

      player.$worker = worker;

      emitter.emit(event, { worker, player });

    // player already logged in, instead: disconnect this socket
    } catch(e) {
      socket.disconnect();
    }
  };

  socket.on('plugin:player:login', login);
};