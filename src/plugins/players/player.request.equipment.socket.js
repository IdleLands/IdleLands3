
import { GameState } from '../../core/game-state';

export const event = 'plugin:player:request:equipment';
export const description = 'Request equipment data. Generally used only when looking at equipment.';
export const args = '';
export const socket = (socket) => {

  const requestequipment = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    if(!playerName) return;
    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    player._updateEquipment();
  };

  socket.on(event, requestequipment);
};