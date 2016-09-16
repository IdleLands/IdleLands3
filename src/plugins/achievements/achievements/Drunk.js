
import { Achievement, AchievementTypes } from '../achievement';

export class Drunk extends Achievement {
  static achievementData(player) {

    const totalSteps = player.$statistics.getStat('Character.Movement.Drunk');

    if(totalSteps < 100000) return [];

    return [{
      tier: 1,
      name: 'Drunk',
      desc: `Gain a special title (and +5% max item score) for ${(100000).toLocaleString()} drunken steps.`,
      type: AchievementTypes.EXPLORE,
      rewards: [{
        type: 'title',
        title: 'Drunk'
      }, {
        type: 'petattr',
        petattr: 'a bottle of booze'
      }, {
        type: 'stats',
        itemFindRangeMultiplier: 0.05
      }]
    }];
  }
}