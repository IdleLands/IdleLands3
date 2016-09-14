
import { Achievement, AchievementTypes } from '../achievement';

export class Eventful extends Achievement {
  static achievementData(player) {

    const totalEvents = player.$statistics.getStat('Character.Events');
    const baseValue = 100;

    let tier = 1;
    while(totalEvents >= baseValue * Math.pow(10, tier-1)) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      itemFindRangeMultiplier: (tier*0.1).toFixed(1)
    }];

    if(tier >= 5) {
      rewards.push({ type: 'title', title: 'Center of Attention' });
    }

    if(tier >= 6) {
      rewards.push({ type: 'petattr', petattr: 'a megaphone' });
    }

    return [{
      tier,
      name: 'Eventful',
      desc: `Equip items that are ${(10*tier).toLocaleString()}% better for experiencing ${(baseValue * Math.pow(10, tier)).toLocaleString()} events.`,
      type: AchievementTypes.EVENT,
      rewards
    }];
  }
}