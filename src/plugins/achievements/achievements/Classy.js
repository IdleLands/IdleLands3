
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

import * as Professions from '../../../core/professions/_all';

const allStats = ['Con', 'Dex', 'Agi', 'Str', 'Int', 'Luk'];

export class Classy extends Achievement {
  static achievementData(player) {

    const allProfessionsBeen = player.$statistics.getStat('Character.Professions');

    return _.flatten(_.map(allProfessionsBeen, (times, prof) => {

      const statReward = {
        type: 'stats'
      };

      _.each(allStats, stat => {
        const profStat = Professions[prof][`base${stat}PerLevel`];
        if(!profStat) return;
        statReward[stat] = profStat;
      });

      const baseAchievements = [{
        tier: 1,
        name: `Classy: ${prof}`,
        desc: `You've been a ${prof}. Gain their base stats as a bonus!`,
        type: AchievementTypes.PROGRESS,
        rewards: [statReward]
      }];

      const tiers = [
        { required: 5,    title: 'Trainee' },
        { required: 15,   title: 'Student' },
        { required: 25,   title: 'Skilled' },
        { required: 50,   title: 'Master' },
        { required: 100,  title: 'Grandmaster' }
      ];

      _.each(tiers, ({ required, title }, index) => {
        if(times < required) return;

        baseAchievements.push({
          tier: index + 1,
          name: `Professional: ${prof}`,
          desc: `You've been a ${prof} ${required} times. Get a title for it!`,
          type: AchievementTypes.PROGRESS,
          rewards: [{ type: 'title', title: `${title} ${prof}` }]
        });
      });

      return baseAchievements;
    }));
  }
}