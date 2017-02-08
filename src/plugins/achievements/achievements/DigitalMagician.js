
import { Achievement, AchievementTypes } from '../achievement';

export class DigitalMagician extends Achievement {
  static achievementData(player) {

    const totalDigitals = player.$statistics.getStat('Combat.Utilize.Digital');

    if(totalDigitals < 30000) return [];

    return [{
      tier: 1,
      name: 'Digital Magician',
      desc: `Gain a special title (and +5% max item score) for ${(30000).toLocaleString()} Digital skill uses.`,
      type: AchievementTypes.COMBAT,
      rewards: [{
        type: 'title',
        title: 'Digital Magician',
        deathMessage: '%player became nothing more than bits and pieces.'
      }, {
        type: 'petattr',
        petattr: 'a digitally signed certificate'
      }, {
        type: 'stats',
        itemFindRangeMultiplier: 0.05
      }]
    }];
  }
}
