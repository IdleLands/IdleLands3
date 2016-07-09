
import { Personality } from '../personality';

export class TreasureHunter extends Personality {
  static description = 'Find better items, but gain less gold and xp.';
  static stats = {
    xp:   (player, baseValue) => -baseValue*0.5,
    gold: (player, baseValue) => -baseValue*0.5,
    itemFindRangeMultiplier: (player) => player.level * 0.05
  };

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Item.Sell') >= 100;
  }
}