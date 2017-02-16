
import { Personality } from '../personality';

export class Bloodthirsty extends Personality {
  static disableOnActivate = ['Coward'];
  static description = 'Be more likely to go into combat, but be more reckless.';
  static stats = {
    BattleChance:       (player, baseValue) => baseValue*2,
    BattlePvPChance:    (player, baseValue) => baseValue*2,
    GoldForsakeChance:  (player, baseValue) => baseValue,
    XPForsakeChance:    (player, baseValue) => baseValue,
    ItemForsakeChance:  (player, baseValue) => baseValue
  };

  static disable(player) {
    super.disable(player);
    this.flagDirty(player, ['BattleChance', 'BattlePvPChance', 'GoldForsakeChance', 'XPForsakeChance', 'ItemForsakeChance']);
  }

  static enable(player) {
    super.enable(player);
    this.flagDirty(player, ['BattleChance', 'BattlePvPChance', 'GoldForsakeChance', 'XPForsakeChance', 'ItemForsakeChance']);
  }

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Event.Battle') >= 500
        && player.$statistics.getStat('Character.Event.BattlePvP') >= 50
        && player.$statistics.getStat('Combat.Win') >= 50;
  }
}