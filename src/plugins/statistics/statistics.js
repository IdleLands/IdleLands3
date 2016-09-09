
import { Dependencies, Container } from 'constitute';
import _ from 'lodash';

import { Logger } from '../../shared/logger';

@Dependencies(Container)
export class Statistics {
  constructor(container) {
    const StatisticsDb = require('./statistics.db').StatisticsDb;
    try {
      container.schedulePostConstructor((statisticsDb) => {
        this.statisticsDb = statisticsDb;
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

  getStat(stat) {
    return _.get(this.stats, stat, 0);
  }

  _addStat(stat, value = 1) {
    let val = _.get(this.stats, stat, 0);
    const oldVal = val;
    val += value;
    if(_.isNaN(val)) val = _.isNaN(oldVal) ? 0 : oldVal;
    _.set(this.stats, stat, val);
  }

  countChild(stat) {
    const obj = _.get(this.stats, stat, {});
    return _.sum(_.values(obj)) || 0;
  }

  incrementStat(stat, value = 1, doSave = false) {
    this._addStat(stat, value);
    if (doSave) {
      this.save();
    }
  }

  batchIncrement(stats, doSave = false) {
    _.each(stats, stat => this._addStat(stat));
    if (doSave) {
      this.save();
    }
  }

  save() {
    this.statisticsDb.saveStatistics(this);
  }
}