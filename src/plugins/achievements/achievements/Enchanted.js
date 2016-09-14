
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

export class Enchanted extends Achievement {

  static permanentProp = 'enchanted';

  static achievementData(player) {

    const isValid = _.get(player, `permanentAchievements.${this.permanentProp}`);
    if(!isValid) {
      const secondCheck = _.reduce(_.values(player.equipment), ((prev, item) => prev + (item.enchantLevel || 0)), 0) >= 100;
      if(secondCheck) {
        _.set(player, `permanentAchievements.${this.permanentProp}`, true);
      } else {
        return [];
      }
    }

    return [{
      tier: 1,
      name: 'Enchanted',
      desc: 'Gain a special title for having 100 concurrent enchantments.',
      type: AchievementTypes.PROGRESS,
      rewards: [{
        type: 'title',
        title: 'Enchanted'
      }, {
        type: 'petattr',
        petattr: 'a blob of arcane dust'
      }]
    }];
  }
}
