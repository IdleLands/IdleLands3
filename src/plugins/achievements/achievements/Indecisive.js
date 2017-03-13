
import { Achievement, AchievementTypes } from '../achievement';

export class Indecisive extends Achievement {
  static achievementData(player) {

    const totalDenies = player.$statistics.getStat('Character.Choice.Indecisive');

    if(totalDenies < 5000) return [];

    const baseReward = {
      tier: 1,
      name: 'Indecisive',
      desc: `Gain a special title (and +5% max item score) for being indecisive about ${(5000).toLocaleString()} choices.`,
      type: AchievementTypes.EVENT,
      rewards: [{
        type: 'title',
        title: 'Indecisive',
        deathMessage: '%player wasn\'t sure about death. Turns out death doesn\'t care.'
      }, {
        type: 'petattr',
        petattr: 'an entropy machine'
      }, {
        type: 'stats',
        itemFindRangeMultiplier: 0.05
      }]
    };

    return [baseReward];
  }
}
