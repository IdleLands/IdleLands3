
import { Achievement, AchievementTypes } from '../achievement';

export class Gambler extends Achievement {
  static achievementData(player) {

    const value = player.$statistics.getStat('Character.Gold.Gamble.Win') + player.$statistics.getStat('Character.Gold.Gamble.Lose');
    const baseValue = 100000;

    let tier = 1;
    while(value >= baseValue * Math.pow(10, tier-1)) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      gold: (player, baseValue) => baseValue * 0.05 * tier,
      goldDisplay: `+${tier * 5}%`
    }];

    if(tier >= 3) {
      rewards.push({ type: 'title', title: 'Gambler', deathMessage: '%player gambled away %hisher life.' });
    }

    if(tier >= 4) {
      rewards.push({ type: 'petattr', petattr: 'a double-headed coin' });
    }

    if(tier >= 5) {
      rewards.push({ type: 'title', title: 'Irresponsible' });
    }

    return [{
      tier,
      name: 'Gambler',
      desc: `Gain ${(tier*5).toLocaleString()}% more gold for gambling at least ${(baseValue * Math.pow(10, tier-1)).toLocaleString()} gold.`,
      type: AchievementTypes.EVENT,
      rewards
    }];
  }
}