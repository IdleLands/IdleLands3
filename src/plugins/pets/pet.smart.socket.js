
import { GameState } from '../../core/game-state';

export const event = 'plugin:pet:smart';
export const description = 'Toggle a smart pet setting.';
export const args = 'setting';
export const socket = (socket) => {

  const petsmart = async({ setting }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);

    player.$pets.togglePetSmartSetting(setting);
  };

  socket.on(event, petsmart);
};