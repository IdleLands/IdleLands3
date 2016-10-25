
import { GameState } from '../../core/game-state';
import { GMCommands } from './commands';
import { Logger } from '../../shared/logger';

import { JSONParser } from '../../shared/asset-loader';
import { Equipment } from '../../core/base/equipment';

export const event = 'plugin:gm:giveitem';
export const description = 'Mod only. Give a custom item to a particular player.';
export const args = 'targetName, targetItemString';
export const socket = (socket, primus, respond) => {

  const giveitem = async({ targetName, targetItemString }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player || !player.isMod) return;

    const target = GameState.getInstance().getPlayer(targetName);

    const item = JSONParser.parseItemString(targetItemString);

    if(!item || !item.type || !item.name) {
      return respond({ type: 'error', notify: 'Invalid item.' });
    }

    Logger.info('Socket:GM:GiveItem', `${playerName} (${socket.address.ip}) giving item "${targetItemString}" to ${targetName}.`);

    const itemInst = new Equipment(item);

    GMCommands.giveItem(target, itemInst);
  };

  socket.on(event, giveitem);
};