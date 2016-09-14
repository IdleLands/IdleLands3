
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

export class Ancient extends Achievement {

  static permanentProp = 'ancient';

  static achievementData(player) {

    const isValid = _.get(player, `permanentAchievements.${this.permanentProp}`);
    if(!isValid) return [];

    const tier = 1;

    const rewards = [{
      type: 'stats',
      str: (player, baseValue) => baseValue*0.01*tier,
      con: (player, baseValue) => baseValue*0.01*tier,
      dex: (player, baseValue) => baseValue*0.01*tier,
      luk: (player, baseValue) => baseValue*0.01*tier,
      int: (player, baseValue) => baseValue*0.01*tier,
      agi: (player, baseValue) => baseValue*0.01*tier,
      strDisplay: `${tier}%`,
      conDisplay: `${tier}%`,
      dexDisplay: `${tier}%`,
      lukDisplay: `${tier}%`,
      intDisplay: `${tier}%`,
      agiDisplay: `${tier}%`
    }];

    rewards.push({ type: 'title', title: 'Ancient' });

    rewards.push({ type: 'petattr', petattr: 'an old rock' });

    return [{
      tier,
      name: 'Ancient',
      desc: 'Gain +1% STR/CON/DEX/AGI/INT/LUK for playing the original IdleLands.',
      type: AchievementTypes.SPECIAL,
      rewards
    }];
  }
}