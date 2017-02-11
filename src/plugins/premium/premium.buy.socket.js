
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:premium:buyilpitem';
export const description = 'Buy items with ILP.';
export const args = 'item';
export const socket = (socket, primus, respond) => {

  const buyilp = async({ item }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:ILP:Buy', `${playerName} (${socket.address.ip}) buying ${JSON.stringify(item)}.`);

    const errMsg = player.$premium.cantBuy(player, item);

    if(errMsg) {
      return respond({ type: 'error', title: 'ILP Buy Error', notify: errMsg });
    }

    player.$premium.buy(player, item);
  };

  socket.on(event, buyilp);
};