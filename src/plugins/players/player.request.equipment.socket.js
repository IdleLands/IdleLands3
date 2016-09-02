
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:request:equipment';
export const socket = (socket) => {

  const requestequipment = async({ playerName }) => {
    if(!playerName) return;
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    player._updateEquipment();
  };

  socket.on(event, requestequipment);
};