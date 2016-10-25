
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:smart';
export const description = 'Toggle a smart pet setting.';
export const args = 'setting';
export const socket = (socket) => {

  const petsmart = async({ setting }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:Smart', `${playerName} (${socket.address.ip}) pet smart toggle ${setting}.`);
    
    player.$pets.togglePetSmartSetting(setting);
  };

  socket.on(event, petsmart);
};