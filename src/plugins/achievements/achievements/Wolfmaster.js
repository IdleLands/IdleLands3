
import * as _ from 'lodash';
import { Achievement, AchievementTypes } from '../achievement';

export class Wolfmaster extends Achievement {
  static achievementData(player) {

    const titles = player.$achievements.titles();

    // there are 6 wolf titles
    const baseValue = 6;

    const ownedTitles = _.filter(titles, title => _.includes(title, 'Wolf'));

    if(ownedTitles.length < baseValue) return [];

    return [{
      tier: 1,
      name: 'Wolfmaster',
      desc: 'Gain a title for getting all of the wolf titles.',
      type: AchievementTypes.EVENT,
      rewards: [{
        type: 'title',
        title: 'Big Bad Wolf',
        deathMessage: '%player went from alpha to beta, just like that.'
      }]
    }];
  }
}
