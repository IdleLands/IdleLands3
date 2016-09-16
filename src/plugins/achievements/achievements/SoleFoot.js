
import { Achievement, AchievementTypes } from '../achievement';

export class SoleFoot extends Achievement {
  static achievementData(player) {

    const soloSteps = player.$statistics.getStat('Character.Movement.Solo');

    if(soloSteps < 100000) return [];

    return [{
      tier: 1,
      name: 'Sole Foot',
      desc: `Gain a special title (and +5% max item score) for taking ${(100000).toLocaleString()} solo steps.`,
      type: AchievementTypes.EXPLORE,
      rewards: [{
        type: 'title',
        title: 'Sole Foot'
      }, {
        type: 'petattr',
        petattr: 'a literal rabbit foot'
      }, {
        type: 'stats',
        itemFindRangeMultiplier: 0.05
      }]
    }];
  }
}
