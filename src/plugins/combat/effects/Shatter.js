
import _ from 'lodash';

import { Effect } from '../effect';

export class Shatter extends Effect {
  constructor(opts) {
    if(!opts.duration) opts.duration = 5;
    super(opts);
  }

  affect(target) {
    _.each(['str', 'dex', 'con'], stat => {
      this.setStat(target, 'agi', -this.statByPercent(target, stat, this.potency * 10));
    });

    this._emitMessage(this.target, '%player\'s defenses were shattered!');
  }
}