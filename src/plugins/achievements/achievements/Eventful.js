
import { Achievement, AchievementTypes } from '../achievement';

export class Eventful extends Achievement {
  static achievementData(player) {

    const totalEvents = player.$statistics.getStat('Character.Events');
    const baseValue = 100;

    let tier = 1;
    while(totalEvents > baseValue * ((tier-1) * 10)) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      itemFindRangeMultiplier: tier*0.1
    }];

    if(tier >= 5) {
      rewards.push({ type: 'title', title: 'Center of Attention' });
    }

    return [{
      tier,
      name: 'Eventful',
      desc: 'Equip items that are 10% better every 100*(tier*10) events.',
      type: AchievementTypes.EVENT,
      rewards
    }];
  }
}