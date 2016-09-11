
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
      desc: `Gain +${tier} LUK and +${tier} Bonus XP (added every time XP is gained) for being level ${(tier*10).toLocaleString()}.`,
      type: AchievementTypes.PROGRESS,
      rewards
    }];
  }
}