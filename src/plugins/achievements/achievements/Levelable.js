
import { Achievement, AchievementTypes } from '../achievement';

export class Levelable extends Achievement {
  static achievementData(player) {
    const tier = Math.floor(player.level/10);
    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      luk: tier,
      xp: tier
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
      desc: 'Gain 1 LUK and 1 XP every 10 levels.',
      type: AchievementTypes.PROGRESS,
      rewards
    }];
  }
}