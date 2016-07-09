
import { Achievement, AchievementTypes } from '../achievement';

export class Golden extends Achievement {
  static achievementData(player) {

    const value = player.$statistics.getStat('Character.Gold.Gain') + player.$statistics.getStat('Character.Gold.Lose');
    const baseValue = 20000;

    let tier = 1;
    while(value > baseValue * Math.pow(10, tier-1)) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      itemValueMultiplier: (tier*0.05).toFixed(1),
      agi: (player, baseValue) => baseValue*0.01*tier
    }];

    if(tier >= 3) {
      rewards.push({ type: 'title', title: 'Golden Child' });
    }

    return [{
      tier,
      name: 'Golden',
      desc: 'Sell items for 5% more for every 20000*(10*tier) gold earned or lost, and +1% AGI per tier.',
      type: AchievementTypes.EVENT,
      rewards
    }];
  }
}