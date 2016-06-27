
import { Dependencies, Container } from 'constitute';
import _ from 'lodash';

import { Logger } from '../../shared/logger';

@Dependencies(Container)
export class Statistics {
  constructor(container) {
    const StatisticsDb = require('./statistics.db').StatisticsDb;
    try {
      container.schedulePostConstructor((statisticsDb) => {
        this.StatisticsDb = statisticsDb;
      }, [StatisticsDb]);
    } catch (e) {
      Logger.error('Statistics', e);
    }
  }

  // clear current variables and set new
  init(opts) {
    this._id = undefined;
    this.stats = undefined;
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
    this.StatisticsDb.saveStatistics(this);
  }
}