
import { Personality } from '../personality';

export class Explorer extends Personality {
  static description = 'You gain 3 more xp from exploring, but your stats are lowered by 3%.';
  static stats = {
    xp: 3,
    str: (player, baseValue) => -baseValue*0.03,
    con: (player, baseValue) => -baseValue*0.03,
    dex: (player, baseValue) => -baseValue*0.03,
    agi: (player, baseValue) => -baseValue*0.03,
    int: (player, baseValue) => -baseValue*0.03
  };

  static disable(player) {
    this.flagDirty(player, ['xp', 'str', 'con', 'agi', 'dex', 'int']);
  }

  static enable(player) {
    this.flagDirty(player, ['xp', 'str', 'con', 'agi', 'dex', 'int']);
  }

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Steps') >= 100000;
  }
}