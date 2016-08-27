
import { Achievement, AchievementTypes } from '../achievement';

export class Sponge extends Achievement {
  static achievementData(player) {

    const value = player.$statistics.getStat('Combat.Take.Damage');
    const baseValue = 1000;

    let tier = 1;
    while(value >= baseValue * Math.pow(10, tier-1)) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      hp: (player, baseValue) => baseValue * 0.01,
      hpDisplay: `+${tier}% HP`,
      con: 20*tier
    }];

    if(tier >= 4) {
      rewards.push({ type: 'title', title: 'Sponge' });
    }

    return [{
      tier,
      name: 'Sponge',
      desc: 'Gain 1% HP and 20 CON for every 1000*(10^tier) damage taken.',
      type: AchievementTypes.COMBAT,
      rewards
    }];
  }
}