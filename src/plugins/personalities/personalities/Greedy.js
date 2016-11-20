
import { Personality } from '../personality';

export class Greedy extends Personality {
  static disableOnActivate = ['Seeker'];
  static description = 'Gain more gold, but gain less xp.';
  static stats = {
    xp:   (player, baseValue) => -baseValue*0.15,
    gold: (player, baseValue) => baseValue*0.15
  };

  static disable(player) {
    super.disable(player);
    this.flagDirty(player, ['xp', 'gold']);
  }

  static enable(player) {
    super.enable(player);
    this.flagDirty(player, ['xp', 'gold']);
  }

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Gold.Gain') >= 100000;
  }
}