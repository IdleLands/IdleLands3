
import { Personality } from '../personality';

export class Greedy extends Personality {
  static disableOnActivate = ['Seeker'];
  static description = 'Gain more gold, but gain less xp.';
  static stats = {
    xp:   (player, baseValue) => -baseValue*0.25,
    gold: (player, baseValue) => baseValue*0.25
  };

  static disable(player) {
    this.flagDirty(player, ['xp', 'gold']);
  }

  static enable(player) {
    this.flagDirty(player, ['xp', 'gold']);
  }

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Gold.Gain') >= 100000;
  }
}