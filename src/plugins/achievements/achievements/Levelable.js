
import { Achievement, AchievementTypes } from '../achievement';

export class Levelable extends Achievement {
  static achievementData(player) {
    const tier = Math.floor(player.level/10);
    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      luk: tier
    }];

    if(tier >= 10) {
      rewards.push({ type: 'title', title: 'Centennial' });
    }

    if(tier >= 20) {
      rewards.push({ type: 'title', title: 'Bicentennial' });
    }

    return [{
      tier,
      name: 'Levelable',
      desc: 'Gain 1 LUK every 10 levels.',
      type: AchievementTypes.PROGRESS,
      rewards
    }];
  }
}