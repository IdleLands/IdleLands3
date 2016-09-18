
import _ from 'lodash';

import { GameState } from '../../core/game-state';

export const event = 'plugin:global:allmaps';
export const description = 'Get all maps for the global page display. Cannot be logged in to execute this function.';
export const args = '';
export const socket = (socket, primus, respond) => {

  const allplayers = async () => {
    if(socket.authToken) return;

    const mapData = _.sortBy(_.map(GameState.getInstance().world.maps, (val, key) => {
      return { name: key, path: val.path };
    }), 'name');

    respond({
      update: 'maps',
      data: mapData
    });

  };

  socket.on(event, allplayers);
};