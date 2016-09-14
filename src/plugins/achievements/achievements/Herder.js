
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

export class Herder extends Achievement {
  static achievementData(player) {

    const allPets = player.$pets.earnedPets;
    return _.map(allPets, ({ name }) => {
      return {
        tier: 1,
        name: `Herder: ${name}`,
        desc: `Can now buy pet ${name}.`,
        type: AchievementTypes.PET,
        rewards: [{ type: 'pet', pet: name }]
      };
    });
  }
}