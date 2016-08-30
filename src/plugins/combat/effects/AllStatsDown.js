
import _ from 'lodash';

import { Effect } from '../effect';

export class AllStatsDown extends Effect {
  affect(target) {
    _.each(['str', 'dex', 'agi', 'luk', 'int', 'con'], stat => {
      this[stat] = -this.statByPercent(target, stat, this.potency);
    });
  }
}