
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:player:togglepersonality';
export const description = 'Turn a personality on or off.';
export const args = 'personality';
export const socket = (socket) => {

  const togglepersonality = async({ personality }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Player:Personality', `${socket.playerName} (${socket.address.ip}) toggling personality ${personality}.`);

    player.togglePersonality(personality);
  };

  socket.on(event, togglepersonality);
};