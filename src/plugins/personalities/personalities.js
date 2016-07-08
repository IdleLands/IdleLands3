
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

  togglePersonality(player, personality, state) {
    this.activePersonalities[personality] = state;
    if(state) {
      AllPersonalities[personality].enable(player);
    }
    this.save();
  }

  isActive(personality) {
    return this.activePersonalities[personality];
  }

  checkPersonalities(player) {
    const earned = this._allPersonalities(player);
    const earnedObjs = _.map(earned, pers => {
      return {
        name: pers.name,
        description: pers.description
      };
    });

    this.earnedPersonalities = earnedObjs;
    this.save();
    
    return earnedObjs;
  }

  save() {
    this.personalitiesDb.savePersonalities(this);
  }
}