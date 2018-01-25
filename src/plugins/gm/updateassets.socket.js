
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:gm:updateassets';
export const description = 'Mod only. Update the assets then reboot.';
export const args = '';
export const socket = (socket) => {

  const updateassets = async() => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;
    Logger.info('Socket:GM:UpdateAssets', `${playerName} (${socket.address.ip}) updating assets.`);

    require('child_process').exec('node install-assets', (e) => {
      if(e) {
        console.error(e);
        return;
      }

      GameState.getInstance().loadWorld();
    });
  };

  socket.on(event, updateassets);
};