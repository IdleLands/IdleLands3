
import { Achievement, AchievementTypes } from '../achievement';

export class Camper extends Achievement {
  static achievementData(player) {

    const totalCamps = player.$statistics.getStat('Character.Movement.Camping');

    if(totalCamps < 100000) return [];

    return [{
      tier: 1,
      name: 'Camper',
      desc: 'Gain a special title for camping for 100000 steps.',
      type: AchievementTypes.EXPLORE,
      rewards: [{
        type: 'title',
        title: 'Camper'
      }]
    }];
  }
}
