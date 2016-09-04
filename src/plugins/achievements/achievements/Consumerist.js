
import { Achievement, AchievementTypes } from '../achievement';

export class Consumerist extends Achievement {
  static achievementData(player) {

    const value = player.$statistics.getStat('Character.Gold.Spent');
    const baseValue = 1000;

    let tier = 1;
    while(value >= baseValue * Math.pow(10, tier-1)) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      itemValueMultiplier: (tier*0.05).toFixed(1),
      dex: (player, baseValue) => baseValue*0.01*tier,
      dexDisplay: `${tier}%`
    }];

    if(tier >= 3) {
      rewards.push({ type: 'title', title: 'Consumerist' });
    }

    return [{
      tier,
      name: 'Consumerist',
      desc: `Sell items for ${tier*5}% more for spending ${baseValue * Math.pow(10, tier)} gold, and gain +${tier*0.01}% DEX.`,
      type: AchievementTypes.EVENT,
      rewards
    }];
  }
}
