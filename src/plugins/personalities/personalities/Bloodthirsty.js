
import { Personality } from '../personality';

export class Bloodthirsty extends Personality {
  static disableOnActivate = ['Coward'];
  static description = 'Be more likely to go into combat, but be more reckless.';
  static stats = {
    BattleChance:       (player, baseValue) => baseValue,
    BattlePvPChance:    (player, baseValue) => baseValue,
    GoldForsakeChance:  (player, baseValue) => baseValue*1.5,
    XPForsakeChance:    (player, baseValue) => baseValue*1.5,
    ItemForsakeChance:  (player, baseValue) => baseValue*1.5
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