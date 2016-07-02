
import { PlayerDb } from './player.db';
import { GameState } from '../../core/game-state';

import { constitute } from '../../shared/di-wrapper';

export const event = 'plugin:player:makechoice';
export const socket = (socket) => {

  const makechoice = async({ playerName, id, response }) => {
    const player = GameState.getInstance().getPlayer(playerName);
    player.handleChoice({ id, response });
  };

  socket.on(event, makechoice);
};