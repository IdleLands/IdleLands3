
import _ from 'lodash';

import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:global:allpets';
export const description = 'Get all pets for the global page display. Cannot be logged in to execute this function.';
export const args = '';
export const socket = (socket, primus, respond) => {

  const allpets = async () => {
    if(socket.authToken) return;
    Logger.info('Socket:Global:Pets', `${socket.address.ip} requesting global pets.`);

    const allPets = _(GameState.getInstance().getPlayers())
      .map(p => p.$pets.activePet)
      .compact()
      .map(pet => {
        const base = _.pick(pet, ['name', 'level', 'professionName']);
        base.owner = pet.$ownerRef.nameEdit || pet.$ownerRef.name;
        base.type = pet.$petId;
        return base;
      })
      .value();

    respond({
      update: 'pets',
      data: allPets
    });

  };

  socket.on(event, allpets);
};