
import { Achievement, AchievementTypes } from '../achievement';

export class Collector extends Achievement {
  static achievementData(player) {

    const totalCollectibles = player.$collectibles.totalCollectibles();

    let tier = 1;
    while(totalCollectibles >= tier * 25) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      agi: (player, baseValue) => baseValue*0.01*tier,
      agiDisplay: `${tier}%`,
      str: (player, baseValue) => baseValue*0.01*tier,
      strDisplay: `${tier}%`,
      dex: (player, baseValue) => baseValue*0.01*tier,
      dexDisplay: `${tier}%`,
      con: (player, baseValue) => baseValue*0.01*tier,
      conDisplay: `${tier}%`,
      int: (player, baseValue) => baseValue*0.01*tier,
      intDisplay: `${tier}%`,
      itemFindRange: tier*50
    }];

    if(tier >= 5) {
      rewards.push({ type: 'title', title: 'Collector' });
    }

    if(tier >= 6) {
      rewards.push({ type: 'petattr', petattr: 'a bauble' });
    }

    return [{
      tier,
      name: 'Collector',
      desc: `Gain +${tier}% AGI/CON/DEX/INT/STR and +${tier*50} max item score for having ${tier*25} collectibles.`,
      type: AchievementTypes.EXPLORE,
      rewards
    }];
  }
}