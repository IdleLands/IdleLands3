
import _ from 'lodash';

import { Effect } from '../effect';

export class Sandwich extends Effect {
  affect(target) {
    const newStats = _.pick(this.extra, ['str', 'dex', 'con', 'agi', 'int', 'luk']);
    _.each(newStats, (val, stat) => {
      this.setStat(target, stat, val);
    });
  }
}