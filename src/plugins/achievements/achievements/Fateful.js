
import { Achievement, AchievementTypes } from '../achievement';

export class Fateful extends Achievement {
  static achievementData(player) {

    const totalFates = player.$statistics.getStat('Character.Event.Providence');

    if(totalFates < 500) return [];

    return [{
      tier: 1,
      name: 'Fateful',
      desc: 'Gain a special title (and +5% max item score) for 500 fate pool uses.',
      type: AchievementTypes.EXPLORE,
      rewards: [{
        type: 'title',
        title: 'Fateful'
      }, {
        type: 'petattr',
        petattr: 'a miniature pool with a question mark in it'
      }, {
        type: 'stats',
        itemFindRangeMultiplier: 0.05
      }]
    }];
  }
}