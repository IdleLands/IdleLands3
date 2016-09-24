
import _ from 'lodash';

import { Effect } from '../effect';

export class DownloadedRAM extends Effect {
  affect(target) {
    _.each(['str', 'dex', 'agi'], stat => {
      this.setStat(target, stat, this.statByPercent(target, stat, this.potency));
    });

    this.setStat(target, 'int', -this.statByPercent(target, 'int', this.potency));
  }
}