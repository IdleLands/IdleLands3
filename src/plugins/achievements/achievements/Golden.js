
import { Achievement, AchievementTypes } from '../achievement';

export class Golden extends Achievement {
  static achievementData(player) {

    const value = player.$statistics.getStat('Character.Gold.Gain') + player.$statistics.getStat('Character.Gold.Lose');
    const baseValue = 20000;

    let tier = 1;
    while(value >= baseValue * Math.pow(10, tier-1)) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      itemValueMultiplier: (tier*0.05).toFixed(2),
      agi: (player, baseValue) => baseValue*0.01*tier,
      agiDisplay: `${tier}%`
    }];

    if(tier >= 3) {
      rewards.push({ type: 'title', title: 'Golden Child' });
    }

    return [{
      tier,
      name: 'Golden',
      desc: `Sell items for ${(tier*5).toLocaleString()}% more for gaining and losing at least ${(baseValue * Math.pow(10, tier-1)).toLocaleString()} gold, and +${tier}% AGI.`,
      type: AchievementTypes.EVENT,
      rewards
    }];
  }
}