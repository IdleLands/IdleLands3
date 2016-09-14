
import { Achievement, AchievementTypes } from '../achievement';

export class Impossible extends Achievement {
  static achievementData(player) {

    const requiredCollectible = player.$collectibles.hasCollectible('How Did You Even Get Out Here');
    if(!requiredCollectible) return [];

    return [{
      tier: 1,
      name: 'Impossible',
      desc: 'Cheater!',
      type: AchievementTypes.SPECIAL,
      rewards: [{
        type: 'title', title: 'l33t h4x0r'
      }, {
        type: 'petattr', petattr: 'a big cheater'
      }]
    }];
  }
}