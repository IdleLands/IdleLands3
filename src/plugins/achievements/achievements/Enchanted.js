
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
      desc: 'Gain a special title (and +10% max item score) for having 100 concurrent enchantments.',
      type: AchievementTypes.PROGRESS,
      rewards: [{
        type: 'title',
        title: 'Enchanted',
        deathMessage: '%player was so transfixed on the transmogrification of %himherself that %she died in the process.'
      }, {
        type: 'petattr',
        petattr: 'a blob of arcane dust'
      }, {
        type: 'stats',
        itemFindRangeMultiplier: 0.1
      }]
    }];
  }
}
