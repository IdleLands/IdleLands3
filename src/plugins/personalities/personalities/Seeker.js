
import { Personality } from '../personality';

export class Seeker extends Personality {
  static disableOnActivate = ['Greedy'];
  static description = 'Gain more xp, but gain less gold.';
  static stats = {
    xp:   (player, baseValue) => baseValue*0.25,
    gold: (player, baseValue) => -baseValue*0.25
  };

  static disable(player) {
    this.flagDirty(player, ['xp', 'gold']);
  }

  static enable(player) {
    this.flagDirty(player, ['xp', 'gold']);
  }

  static hasEarned(player) {
    return player.$statistics.getStat('Character.XP.Gain') >= 100000;
  }
}