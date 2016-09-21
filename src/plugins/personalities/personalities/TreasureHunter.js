
import { Personality } from '../personality';

export class TreasureHunter extends Personality {
  static description = 'Find better items, but gain significantly less gold and xp.';
  static stats = {
    xp:   (player, baseValue) => -baseValue*0.1,
    gold: (player, baseValue) => -baseValue*0.1,
    itemFindRangeMultiplier: (player) => player.level * 0.05
  };

  static disable(player) {
    player.recalculateStats();
  }

  static enable(player) {
    player.recalculateStats();
  }

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Item.Sell') >= 100;
  }
}