
import { GameState } from '../../core/game-state';
import { Logger } from '../../shared/logger';

export const event = 'plugin:premium:buyilp';
export const description = 'Buy ILP with gold.';
export const args = 'ilpBuy';
export const socket = (socket, primus, respond) => {

  const buyilp = async({ ilpBuy }) => {
    if(!socket.authToken) return;

    const { playerName } = socket.authToken;
    if(!playerName) return;

    const player = GameState.getInstance().getPlayer(playerName);
    if(!player) return;
    Logger.info('Socket:ILP:Buy', `${playerName} (${socket.address.ip}) buying ${ilpBuy} ILP.`);

    ilpBuy = +ilpBuy;

    if(!player.$premium.canBuyIlp(player, ilpBuy)) {
      return respond({ type: 'error', title: 'Buy ILP Error', notify: 'You do not have enough gold for that.' });
    }

    player.$premium.buyIlp(player, ilpBuy);
  };

  socket.on(event, buyilp);
};