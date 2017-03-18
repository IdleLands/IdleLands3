
import { Achievement, AchievementTypes } from '../achievement';

export class Jailbird extends Achievement {
  static achievementData(player) {

    const requiredCollectible = player.$collectibles.hasCollectible('Jail Brick');
    if(!requiredCollectible) return [];

    return [{
      tier: 1,
      name: 'Jailbird',
      desc: 'You got the jail brick. Enjoy an incredibly rare title!',
      type: AchievementTypes.SPECIAL,
      rewards: [{
        type: 'title', title: 'Jailbird', deathMessage: '%player went to the jail where people die and died.'
      }, {
        type: 'petattr', petattr: 'a jail brick'
      }]
    }];
  }
}