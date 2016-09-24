
import { Achievement, AchievementTypes } from '../achievement';

export class TempterOfFate extends Achievement {
  static achievementData(player) {

    const totalFates = player.$statistics.getStat('Character.Event.Providence');

    if(totalFates < 100000) return [];

    return [{
      tier: 1,
      name: 'Tempter of Fate',
      desc: 'Gain a special title for 100,000 fate pool uses (AKA: being literally insane).',
      type: AchievementTypes.EXPLORE,
      rewards: [{
        type: 'title',
        title: 'Tempter of Fate'
      }, {
        type: 'petattr',
        petattr: 'a crazy hat that instills craziness'
      }]
    }];
  }
}