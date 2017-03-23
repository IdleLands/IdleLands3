
import { Achievement, AchievementTypes } from '../achievement';

export class Scrappy extends Achievement {
  static achievementData(player) {

    const totalSalvages = player.$statistics.getStat('Character.Item.Salvage');

    if(totalSalvages < 100000) return [];

    const baseReward = {
      tier: 1,
      name: 'Scrappy',
      desc: `Gain a special title for ${(100000).toLocaleString()} item salvages.`,
      type: AchievementTypes.PROGRESS,
      rewards: [{
        type: 'title',
        title: 'Scrappy',
        deathMessage: '%player got scrapped.'
      }, {
        type: 'petattr',
        petattr: 'a scrap of metal'
      }]
    };

    return [baseReward];
  }
}