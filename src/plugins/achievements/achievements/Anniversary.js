import { Achievement, AchievementTypes } from '../achievement';

export class Anniversary extends Achievement {
  static achievementData(player) {

    const playerSteps = player.$statistics.getStat('Character.Steps');
    const totalCamps = player.$statistics.getStat('Character.Movement.Camping');

    if(playerSteps + totalCamps < 6311520) return [];
    
    let tier = 1;
    while(playerSteps + totalCamps >= 6311520 * tier) {
      tier++;
    }
    
    tier--;

    if(tier === 0) return [];
    
    const rewards = [{
      type: 'stats',
      xp: tier * 100,
      str: (player, baseValue) => baseValue*0.01*tier,
      con: (player, baseValue) => baseValue*0.01*tier,
      dex: (player, baseValue) => baseValue*0.01*tier,
      luk: (player, baseValue) => baseValue*0.01*tier,
      int: (player, baseValue) => baseValue*0.01*tier,
      agi: (player, baseValue) => baseValue*0.01*tier,
      strDisplay: `+${tier}%`,
      conDisplay: `+${tier}%`,
      dexDisplay: `+${tier}%`,
      lukDisplay: `+${tier}%`,
      intDisplay: `+${tier}%`,
      agiDisplay: `+${tier}%`
    }];
    
    rewards.push({ type: 'petattr', petattr: 'a handful of confetti' });
    
    if(tier >= 2) {
      rewards.push({ type: 'petattr', petattr: 'two handfuls of confetti' });
    }
    
    if(tier >= 3) {
      rewards.push({ type: 'petattr', petattr: 'a thousand-yard stare' });
    }
    
    return [{
      tier,
      name: 'Anniversary',
      desc: `Gain +${tier * 100} Bonus XP (added every time XP is gained) and +%{tier}% STR/CON/DEX/AGI/INT/LUK for taking +%{tier} year(s) worth of steps.`,
      type: AchievementTypes.EXPLORE,
      rewards
    }];
  }
}
