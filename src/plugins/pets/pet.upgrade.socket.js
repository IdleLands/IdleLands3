
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:pet:upgrade';
export const description = 'Upgrade a facet of your pet.';
export const args = 'upgradeAttr';
export const socket = (socket) => {

  const upgrade = async({ upgradeAttr }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:Pet:Upgrade', `${playerName} (${socket.address.ip}) pet upgrade ${upgradeAttr}.`);
    
    player.$pets.upgradePet(player, upgradeAttr);
  };

  socket.on(event, upgrade);
};