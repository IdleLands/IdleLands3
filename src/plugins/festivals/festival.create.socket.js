
import _ from 'lodash';

import { GameState } from '../../core/game-state';
import { GMCommands } from '../gm/commands';
import { Logger } from '../../shared/logger';

import { JSONParser } from '../../shared/asset-loader';

export const event = 'plugin:festival:create';
export const description = 'Mod only. Create a festival.';
export const args = 'targetFestivalString';
export const socket = (socket, primus, respond) => {

  const createfestival = async({ targetFestivalString }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;

    const festival = JSONParser.parseFestivalString(targetFestivalString);

    if(!festival || !festival.hours || !festival.name) {
      return respond({ type: 'error', notify: 'Invalid festival.' });
    }

    Logger.info('Socket:GM:CreateFestival', `${playerName} (${socket.address.ip}) creating festival "${targetFestivalString}".`);

    const bonuses = _.omit(festival, ['hours', 'name']);

    const realFestival = {
      hourDuration: festival.hours,
      bonuses,
      name: festival.name,
      message: `${player.fullname} has started the "${festival.name}" festival! It will last ${festival.hours} hours!`
    };

    GMCommands.createFestival(realFestival);
  };

  socket.on(event, createfestival);
};