
import { Personality } from '../personality';

export class Salvager extends Personality {
  static disableOnActivate = ['TreasureHunter', 'Greedy'];

  static description = 'You salvage instead of sell. Cuts gold gain by 95%. Only effective for guild members.';

  static stats = {
    gold: (player, baseValue) => -baseValue*0.95
  };

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Item.Salvage') >= 100;
  }
}