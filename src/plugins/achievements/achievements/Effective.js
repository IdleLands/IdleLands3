
import { Achievement, AchievementTypes } from '../achievement';

export class Effective extends Achievement {
  static achievementData(player) {

    const value = player.$statistics.countChild('Combat.Give.Effect');
    const baseValue = 200;

    let tier = 1;
    while(value >= baseValue * tier) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      mp: (player, baseValue) => baseValue * 0.01,
      mpDisplay: `+${tier}% MP`
    }];

    if(tier >= 5) {
      rewards.push({ type: 'title', title: 'Effective' });
    }

    return [{
      tier,
      name: 'Effective',
      desc: `+${tier}% MP for ${(tier*200).toLocaleString()} combat effect usages.`,
      type: AchievementTypes.COMBAT,
      rewards
    }];
  }
}
