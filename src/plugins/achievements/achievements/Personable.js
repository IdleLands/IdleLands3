
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

export class Personable extends Achievement {
  static achievementData(player) {

    const allPersonalities = player.$personalities._allPersonalities(player);
    return _.map(allPersonalities, pers => {
      return {
        tier: 1,
        name: `Personable: ${pers.name}`,
        desc: `Can now use personality ${pers.name}.`,
        type: AchievementTypes.PROGRESS,
        rewards: [{ type: 'personality', name: pers.name }]
      };
    });
  }
}