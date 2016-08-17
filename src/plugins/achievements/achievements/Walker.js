
import { Achievement, AchievementTypes } from '../achievement';

export class Walker extends Achievement {
  static achievementData(player) {

    const playerSteps = player.$statistics.getStat('Character.Steps');

    let tier = 1;
    while(playerSteps >= Math.pow(10, tier)) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      xp: tier
    }];

    if(tier >= 6) {
      rewards.push({ type: 'title', title: 'Tired Foot' });
    }

    return [{
      tier,
      name: 'Walker',
      desc: 'Gain 1 bonus xp every 10^N steps.',
      type: AchievementTypes.EXPLORE,
      rewards
    }];
  }
}