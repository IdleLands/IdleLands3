
import _ from 'lodash';

import { Effect } from '../effect';

export class PhysicalStatBoost extends Effect {
  affect(target) {
    _.each(['str', 'dex', 'agi'], stat => {
      this.setStat(target, stat, this.statByPercent(target, stat, this.potency));
    });
  }
}