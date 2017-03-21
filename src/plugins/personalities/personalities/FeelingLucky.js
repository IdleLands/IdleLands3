
import { Personality } from '../personality';

const hasEarned = (player) => {
  return player.$statistics.getStat('Character.Event.Gambling') >= 100
    && player.$statistics.getStat('Character.Gamble.DoubleDown') >= player.$statistics.getStat('Character.Event.Gambling')/4
    && player.$achievements.hasAchievement('Gambler');
};

export class FeelingLucky extends Personality {
  static description = 'Gambling is your only form of income.';
  static stats = {
    GamblingChance:     (player, baseValue) => hasEarned(player) ? baseValue * 2 : 0,
    GoldForsakeChance:  (player, baseValue) => hasEarned(player) ? -baseValue * 10 : 0,
    GoldBlessChance:    (player, baseValue) => hasEarned(player) ? -baseValue * 10 : 0
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