
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

export class Contributor extends Achievement {

  static permanentProp = 'contributor';

  static achievementData(player) {

    const isValid = _.get(player, `permanentAchievements.${this.permanentProp}`);
    if(!isValid) return [];

    const tier = 1;

    const rewards = [{ type: 'title', title: 'Contributor' }, { type: 'petattr', petattr: 'a gold coin that says thank you' }];

    return [{
      tier,
      name: 'Contributor',
      desc: 'You contributed! Yay! Thanks!',
      type: AchievementTypes.SPECIAL,
      rewards
    }];
  }
}