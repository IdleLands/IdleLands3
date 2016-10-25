
import _ from 'lodash';

import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

import allteleports from '../../../assets/maps/content/teleports.json';

const compressedTeleports = _.extend({}, allteleports.towns, allteleports.bosses, allteleports.dungeons, allteleports.trainers, allteleports.other);

export const event = 'plugin:global:allmaps';
export const description = 'Get all maps for the global page display. Cannot be logged in to execute this function.';
export const args = '';
export const socket = (socket, primus, respond) => {

  const allplayers = async () => {
    if(socket.authToken) return;
    Logger.info('Socket:Global:Maps', `${socket.address.ip} requesting global maps.`);

    const mapData = _.sortBy(_.map(GameState.getInstance().world.maps, (val, key) => {
      return { name: key, path: val.path };
    }), 'name');

    respond({
      update: 'maps',
      data: { maps: mapData, teleports: compressedTeleports }
    });

  };

  socket.on(event, allplayers);
};