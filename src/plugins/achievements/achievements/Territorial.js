
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

export class Territorial extends Achievement {
  static achievementData(player) {

    const totalRegions = _.size(player.$statistics.getStat('Character.Regions'));

    let tier = 1;
    while(totalRegions > tier * 10) {
      tier++;
    }

    tier--;

    if(tier === 0) return [];

    const rewards = [{
      type: 'stats',
      str: tier*10
    }];

    if(tier >= 10) {
      rewards.push({ type: 'title', title: 'Territorial' });
    }

    return [{
      tier,
      name: 'Territorial',
      desc: 'Gain 10 bonus STR for every 10 unique regions explored.',
      type: AchievementTypes.EXPLORE,
      rewards
    }];
  }
}