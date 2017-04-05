
import { Achievement, AchievementTypes } from '../achievement';

export class Unequippable extends Achievement {
  static achievementData(player) {

    const totalUnequippable = player.$statistics.getStat('Character.Item.Unequippable');

    if(totalUnequippable < 100000) return [];

    const baseReward = {
      tier: 1,
      name: 'Unequippable',
      desc: `Gain a special title for ${(100000).toLocaleString()} unable-to-equip items.`,
      type: AchievementTypes.PROGRESS,
      rewards: [{
        type: 'title',
        title: 'Unequippable',
        deathMessage: '%player\'s corpse wasn\'t equippable.'
      }, {
        type: 'petattr',
        petattr: 'an unequippable item'
      }]
    };

    return [baseReward];
  }
}