
import _ from 'lodash';

import { Achievement, AchievementTypes } from '../achievement';

import * as Professions from '../../../core/professions/_all';

export class Classfluid extends Achievement {
  static achievementData(player) {

    const allProfessionsBeen = player.$statistics.getStat('Character.Professions');
    const allProfessionBeenCount = _.keys(allProfessionsBeen);
    const allProfessions = _.keys(Professions);

    if(allProfessions.length !== allProfessionBeenCount.length) return [];

    let tier = 0;
    while(++tier) {
      if(!_.every(allProfessions, prof => allProfessionsBeen[prof] >= tier)) break;
    }

    tier--;

    return [{
      tier,
      name: 'Classfluid',
      desc: `+${3*tier}% STR/CON/DEX/INT/AGI/LUK for being each profession ${tier} times.`,
      type: AchievementTypes.PROGRESS,
      rewards: [{
        type: 'title',
        title: 'Fluidic'
      }, {
        type: 'petattr',
        petattr: 'a drop of water'
      }, {
        type: 'stats',
        agi: (player, baseValue) => baseValue*0.03*tier,
        agiDisplay: `${tier*3}%`,
        str: (player, baseValue) => baseValue*0.03*tier,
        strDisplay: `${tier*3}%`,
        dex: (player, baseValue) => baseValue*0.03*tier,
        dexDisplay: `${tier*3}%`,
        con: (player, baseValue) => baseValue*0.03*tier,
        conDisplay: `${tier*3}%`,
        int: (player, baseValue) => baseValue*0.03*tier,
        intDisplay: `${tier*3}%`,
        luk: (player, baseValue) => baseValue*0.03*tier,
        lukDisplay: `${tier*3}%`
      }]
    }];
  }
}