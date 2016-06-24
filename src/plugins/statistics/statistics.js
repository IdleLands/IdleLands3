
import _ from 'lodash';
import { saveStatistics } from './statistics.db';

export class Statistics {
  constructor(opts) {
    _.extend(this, opts);
  }

  incrementStat(stat) {
    this.stats[stat] = this.stats[stat] || 0;
    this.stats[stat]++;
    this.save();
  }

  save() {
    saveStatistics(this);
  }
}