
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

export class Territorial extends Achievement {
  static achievementData(player) {

    const totalRegions = _.size(player.$statistics.getStat('Character.Regions'));

    let tier = 1;
    while(totalRegions >= tier * 10) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      str: (player, baseValue) => baseValue*0.01*tier,
      strDisplay: `${tier}%`
    }];

    if(tier >= 10) {
      rewards.push({ type: 'title', title: 'Territorial' });
    }

    return [{
      tier,
      name: 'Territorial',
      desc: `Gain +${tier}% STR for every ${(tier*10).toLocaleString()} unique regions explored.`,
      type: AchievementTypes.EXPLORE,
      rewards
    }];
  }
}