
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

export class Explorative extends Achievement {
  static achievementData(player) {

    const totalMaps = _.size(player.$statistics.getStat('Character.Maps'));

    let tier = 1;
    while(totalMaps >= tier * 5) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      int: (player, baseValue) => baseValue*0.01*tier,
      intDisplay: `${tier}%`
    }];

    if(tier >= 5) {
      rewards.push({ type: 'title', title: 'Explorative' });
    }

    return [{
      tier,
      name: 'Explorative',
      desc: `Gain +${tier}% INT for exploring ${(tier*5).toLocaleString()} unique maps.`,
      type: AchievementTypes.EXPLORE,
      rewards
    }];
  }
}