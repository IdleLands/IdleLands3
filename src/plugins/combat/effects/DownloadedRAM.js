
import _ from 'lodash';

import { Effect } from '../effect';

export class DownloadedRAM extends Effect {
  affect(target) {
    _.each(['str', 'dex', 'agi'], stat => {
      this[stat] = this.statByPercent(target, stat, this.potency);
    });

    this.int = -this.statByPercent(target, 'int', this.potency);
  }
}