
import { Achievement, AchievementTypes } from '../achievement';

export class Camper extends Achievement {
  static achievementData(player) {

    const totalCamps = player.$statistics.getStat('Character.Movement.Camping');

    if(totalCamps < 100000) return [];

    return [{
      tier: 1,
      name: 'Camper',
      desc: `Gain a special title (and +5% max item score) for camping for ${(100000).toLocaleString()} steps.`,
      type: AchievementTypes.EXPLORE,
      rewards: [{
        type: 'title',
        title: 'Camper',
        deathMessage: '%player found out the hard way that campfires are hot.'
      }, {
        type: 'petattr',
        petattr: 'a flaming log'
      }, {
        type: 'stats',
        itemFindRangeMultiplier: 0.05
      }]
    }];
  }
}
