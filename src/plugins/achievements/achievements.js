
import { Dependencies, Container } from 'constitute';
import _ from 'lodash';

import * as AllAchievements from './achievements/_all';

import { Logger } from '../../shared/logger';

import { SETTINGS } from '../../static/settings';

const PREMIUM_TITLES = [
  'Donator',
  'Contributor'
];

const PREMIUM_TIERS = {
  Donator: 1,
  Contributor: 2
};

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

    if(!this.uniqueAchievements) {
      this.save();
    }
  }

  premiumTier() {
    const tiers = _.intersection(PREMIUM_TITLES, this.titles());
    if(tiers.length === 0) return 0;
    return PREMIUM_TIERS[_.maxBy(tiers, tier => PREMIUM_TIERS[tier])];
  }

  petAttributes() {
    return _(this.achievements)
      .values()
      .map(achi => achi.rewards)
      .flattenDeep()
      .compact()
      .filter(reward => reward.type === 'petattr')
      .map(reward => reward.petattr)
      .value().concat(SETTINGS.validPetAttributes);
  }

  titles() {
    return _(this.achievements)
      .values()
      .map(achi => achi.rewards)
      .flattenDeep()
      .compact()
      .filter(reward => reward.type === 'title')
      .map(reward => reward.title)
      .value();
  }

  getDeathMessageForTitle(title) {
    const titleReward = _(this.achievements)
      .values()
      .map(achi => achi.rewards)
      .flattenDeep()
      .compact()
      .filter(reward => reward.type === 'title')
      .filter(reward => reward.title === title)
      .value()[0];

    if(titleReward) return titleReward.deathMessage;
    return '';
  }

  tiers() {
    return _(this.achievements)
      .values()
      .flattenDeep()
      .map('tier')
      .sum();
  }

  _allAchievements(player) {
    return _(AllAchievements)
      .values()
      .map(ach => ach.achievementData(player) || [])
      .flattenDeep()
      .compact()
      .value();
  }

  addAchievement(achievement) {
    this.achievements[achievement.name] = achievement;
  }

  hasAchievement(achievement) {
    return this.achievements[achievement];
  }

  hasAchievementAtTier(achievement, tier) {
    return this.hasAchievement(achievement) && this.achievements[achievement].tier >= tier;
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

    if(newAchievements.length > 0) {
      player.recalculateStats();
    }

    return newAchievements;
  }

  uniqueAchievementCount() {
    return _.size(this.achievements);
  }

  save() {
    this.uniqueAchievements = this.uniqueAchievementCount();
    this.totalAchievementTiers = this.tiers();
    this.totalTitles = this.titles().length;
    this.achievementsDb.saveAchievements(this);
  }
}