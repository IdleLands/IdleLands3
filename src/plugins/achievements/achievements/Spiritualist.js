
import { Achievement, AchievementTypes } from '../achievement';

export class Spiritualist extends Achievement {
  static achievementData(player) {

    const requiredCollectible = player.$collectibles.hasCollectible('Jail Brick') || player.$collectibles.hadCollectible('Jail Brick');
    if(!requiredCollectible) return [];

    return [{
      tier: 1,
      name: 'Spiritualist',
      desc: 'Get a title for getting max level on the ghostly pets!',
      type: AchievementTypes.PET,
      rewards: [{
        type: 'title', title: 'Jailbird', deathMessage: '%player went to the jail where people die and died.'
      }, {
        type: 'petattr', petattr: 'a miniature ghost that says boo a lot'
      }]
    }];
  }
}