
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

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
    Logger.info('Socket:Player:RequestEquipment', `${socket.playerName} (${socket.address.ip}) requesting equipment.`);

    player._updateEquipment();
  };

  socket.on(event, requestequipment);
};