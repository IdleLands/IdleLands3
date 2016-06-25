
import _ from 'lodash';
import { saveStatistics } from './statistics.db';

export class Statistics {
  constructor(opts) {
    _.extend(this, opts);
  }

  _addStat(stat, value = 1) {
    let val = _.get(this.stats, stat, 0);
    val += value;
    _.set(this.stats, stat, val);
  }

  incrementStat(stat, value = 1) {
    this._addStat(stat, value);
    this.save();
  }

  batchIncrement(stats) {
    _.each(stats, stat => this._addStat(stat));
    this.save();
  }

  save() {
    saveStatistics(this);
  }
}