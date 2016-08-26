
import _ from 'lodash';

import { Effect } from '../effect';

export class Cookie extends Effect {
  affect(target) {
    _.each(['str', 'dex', 'agi', 'con', 'luk', 'int'], stat => {
      this[stat] = this.statByPercent(target, stat, this.potency);
    });
  }
}