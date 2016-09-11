
import { Achievement, AchievementTypes } from '../achievement';

export class Slayer extends Achievement {
  static achievementData(player) {

    const value = player.$statistics.getStat('Combat.Kills.Monster');
    const baseValue = 10;

    let tier = 1;
    while(value >= baseValue * Math.pow(10, tier-1)) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      str: 5*tier,
      con: 5*tier,
      dex: 5*tier,
      int: 5*tier,
      agi: 5*tier,
      itemFindRangeMultiplier: (tier*0.1).toFixed(1)
    }];

    if(tier >= 5) {
      rewards.push({ type: 'title', title: 'Slayer' });
    }

    return [{
      tier,
      name: 'Slayer',
      desc: `Gain +${(tier*5).toLocaleString()} STR/CON/DEX/INT/AGI and +${(tier*10).toLocaleString()}% better item find for killing ${(baseValue * Math.pow(10, tier-1)).toLocaleString()} monsters.`,
      type: AchievementTypes.COMBAT,
      rewards
    }];
  }
}
