
import { Dependencies, Container } from 'constitute';
import _ from 'lodash';

import * as AllAchievements from './achievements/_all';

import { Logger } from '../../shared/logger';

@Dependencies(Container)
export class Achievements {
  constructor(container) {
    const AchievementsDb = require('./achievements.db').AchievementsDb;
    try {
      container.schedulePostConstructor((achievementsDb) => {
        this.achievementsDb = achievementsDb;
      }, [AchievementsDb]);
    } catch (e) {
      Logger.error('Achievements', e);
    }
  }

  // clear current variables and set new
  init(opts) {
    this._id = undefined;
    this.achievements = undefined;
    _.extend(this, opts);
  }

  titles() {
    return _(this.achievements)
      .values()
      .map(achi => achi.rewards)
      .flattenDeep()
      .filter(reward => reward.type === 'title')
      .map(reward => reward.title)
      .value();
  }

  _allAchievements(player) {
    return _(AllAchievements)
      .values()
      .map(ach => ach.achievementData(player))
      .flatten()
      .value();
  }

  addAchievement(achievement) {
    this.achievements[achievement.name] = achievement;
  }

  checkAchievements(player) {
    const earned = this._allAchievements(player);
    const mine = this.achievements;

    const newAchievements = [];
    _.each(earned, ach => {
      if(mine[ach.name] && mine[ach.name].tier >= ach.tier) return;
      newAchievements.push(ach);
    });

    // always update the achievement data just in case
    this.achievements = {};
    _.each(earned, ach => this.addAchievement(ach));

    this.save();

    return newAchievements;
  }

  save() {
    this.achievementsDb.saveAchievements(this);
  }
}