
import { Achievement, AchievementTypes } from '../achievement';

export class Achiever extends Achievement {
  static achievementData(player) {

    const value = player.$achievements.tiers();
    const baseValue = 30;

    let tier = 1;
    while(value > baseValue * tier) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [];

    if(tier >= 5) {
      rewards.push({ type: 'title', title: 'Achiever' });
    }

    return [{
      tier,
      name: 'Achiever',
      desc: `+${tier} achievement${tier > 1 ? 's': ''}`,
      type: AchievementTypes.EVENT,
      rewards
    }];
  }
}
