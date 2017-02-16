
import { Personality } from '../personality';

export class FeelingLucky extends Personality {
  static description = 'Gambling is your only form of income.';
  static stats = {
    GamblingChance:     (player, baseValue) => this.hasEarned(player) ? baseValue * 2 : 0,
    GoldForsakeChance:  (player, baseValue) => this.hasEarned(player) ? -baseValue * 10 : 0,
    GoldBlessChance:    (player, baseValue) => this.hasEarned(player) ? -baseValue * 10 : 0
  };

  static disable(player) {
    super.disable(player);
    this.flagDirty(player, ['GamblingChance', 'GoldBlessChance', 'GoldForsakeChance']);
  }

  static enable(player) {
    super.enable(player);
    this.flagDirty(player, ['GamblingChance', 'GoldBlessChance', 'GoldForsakeChance']);
  }

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Event.Gambling') >= 100
        && player.$statistics.getStat('Character.Gamble.DoubleDown') >= player.$statistics.getStat('Character.Event.Gambling')/4
        && player.$achievements.hasAchievement('Gambler');
  }
}