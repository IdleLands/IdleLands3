
import { Achievement, AchievementTypes } from '../achievement';

export class SoleFoot extends Achievement {
  static achievementData(player) {

    const soloSteps = player.$statistics.getStat('Character.Movement.Solo');

    if(soloSteps < 100000) return [];

    return [{
      tier: 1,
      name: 'Sole Foot',
      desc: `Gain a special title for taking ${(100000).toLocaleString()} solo steps.`,
      type: AchievementTypes.EXPLORE,
      rewards: [{
        type: 'title',
        title: 'Sole Foot'
      }]
    }];
  }
}
