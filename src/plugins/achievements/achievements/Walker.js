
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
      desc: `Gain +${tier} Bonus XP (added every time XP is gained) for taking ${(Math.pow(10, tier)).toLocaleString()} steps.`,
      type: AchievementTypes.EXPLORE,
      rewards
    }];
  }
}