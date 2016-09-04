
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

import * as Professions from '../../../core/professions/_all';

const allStats = ['Con', 'Dex', 'Agi', 'Str', 'Int', 'Luk'];

export class Classy extends Achievement {
  static achievementData(player) {

    const allProfessionsBeen = _.keys(player.$statistics.getStat('Character.Professions'));

    return _.map(allProfessionsBeen, prof => {

      const statReward = {
        type: 'stats'
      };

      _.each(allStats, stat => {
        const profStat = Professions[prof][`base${stat}PerLevel`];
        if(!profStat) return;
        statReward[stat] = profStat;
      });

      return {
        tier: 1,
        name: `Classy: ${prof}`,
        desc: `You've been a ${prof}. Gain their base stats as a bonus!`,
        type: AchievementTypes.PROGRESS,
        rewards: [statReward]
      };
    });
  }
}