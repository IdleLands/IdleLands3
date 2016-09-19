
import { GameState } from '../../core/game-state';

export const event = 'plugin:global:pet';
export const description = 'Get all pet information for the global page display. Cannot be logged in to execute this function.';
export const args = 'playerName';
export const socket = (socket, primus, respond) => {

  const pet = async ({ playerName }) => {
    if(socket.authToken) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return respond({ update: 'pet', data: {} });

    const pet = player.$pets.activePet;
    if(!pet) return respond({ update: 'pet', data: {} });

    respond({
      update: 'pet',
      data: pet.buildTransmitObject()
    });

  };

  socket.on(event, pet);
};