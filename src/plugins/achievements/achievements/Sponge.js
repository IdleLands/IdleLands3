
import { Achievement, AchievementTypes } from '../achievement';

export class Sponge extends Achievement {
  static achievementData(player) {

    const value = player.$statistics.getStat('Combat.Receive.Damage');
    const baseValue = 1000;

    let tier = 1;
    let calcValue = 0;
    while(value >= (calcValue = baseValue * Math.pow(10, tier-1))) {
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
      desc: `Gain +${tier}% HP and +${tier*20} CON for taking ${calcValue} damage.`,
      type: AchievementTypes.COMBAT,
      rewards
    }];
  }
}