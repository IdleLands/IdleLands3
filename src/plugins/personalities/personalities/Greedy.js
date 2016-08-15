
import { Personality } from '../personality';

export class Greedy extends Personality {
  static disableOnActivate = ['Seeker'];
  static description = 'Gain more gold, but gain less xp.';
  static stats = {
    xp:   (player, baseValue) => -baseValue*0.25,
    gold: (player, baseValue) => baseValue*0.25
  };

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Gold.Gain') >= 100000;
  }
}