
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

export class Donator extends Achievement {

  static permanentProp = 'paypalDonator';

  static achievementData(player) {

    const isValid = _.get(player, `permanentAchievements.${this.permanentProp}`);
    if(!isValid) return [];

    const tier = 1;

    const rewards = [{ type: 'title', title: 'Donator' }];

    return [{
      tier,
      name: 'Donator',
      desc: 'You donated (via PayPal)! Yay! Thanks for being an early supporter!',
      type: AchievementTypes.SPECIAL,
      rewards
    }];
  }
}