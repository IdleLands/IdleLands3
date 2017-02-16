
import { Dependencies, Container } from 'constitute';
import _ from 'lodash';

import * as AllPersonalities from './personalities/_all';

import { Logger } from '../../shared/logger';

@Dependencies(Container)
export class Personalities {
  constructor(container) {
    const PersonalitiesDb = require('./personalities.db.js').PersonalitiesDb;
    try {
      container.schedulePostConstructor((personalitiesDb) => {
        this.personalitiesDb = personalitiesDb;
      }, [PersonalitiesDb]);
    } catch (e) {
      Logger.error('Personalities', e);
    }
  }

  // clear current variables and set new
  init(opts) {
    this._id = undefined;
    this.activePersonalities = {};
    this.earnedPersonalities = [];
    _.extend(this, opts);
  }

  _allPersonalities(player) {
    return _(AllPersonalities)
      .values()
      .filter(ach => ach.hasEarned(player))
      .value();
  }

  _activePersonalityData() {
    return _(this.earnedPersonalities)
      .filter(({ name }) => this.isActive(name))
      .map(({ name }) => AllPersonalities[name])
      .value();
  }

  turnAllOff(player) {
    _.each(_.keys(this.activePersonalities), pers => {
      if(!this.activePersonalities[pers]) return;
      this.togglePersonality(player, pers);
    });
  }

  togglePersonality(player, personality) {
    const newState = !this.activePersonalities[personality];
    this.activePersonalities[personality] = newState;
    if(newState) {
      AllPersonalities[personality].enable(player);
    } else {
      AllPersonalities[personality].disable(player);
    }
    this.save();
  }

  isAnyActive(personalities) {
    return _.some(personalities, p => this.isActive(p));
  }

  isActive(personality) {
    return this.activePersonalities[personality];
  }

  checkPersonalities(player) {
    const earned = this._allPersonalities(player);
    const earnedObjs = _.sortBy(_.map(earned, pers => {
      return {
        name: pers.name,
        description: pers.description
      };
    }), 'name');

    this.earnedPersonalities = earnedObjs;
    // this.save(); - these are regenerated a lot, this is not really necessary except on toggle

    return earnedObjs;
  }

  save() {
    this.personalitiesDb.savePersonalities(this);
  }
}