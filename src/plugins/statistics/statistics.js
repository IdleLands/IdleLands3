
import { Dependencies, Container } from 'constitute';
import * as _ from 'lodash';

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
    let val = _.get(this.stats, stat, 0);
    if(!_.isObject(val) && !_.isFinite(val) || _.isNaN(val)) {
      val = 0;
      this.setStat(stat, 0);
      Logger.error('Statistics', new Error(`${this._id} has infinity or NaN for ${stat}. Fix it!`));
    }
    return val;
  }

  _addStat(stat, value = 1) {
    if(!_.isFinite(value)) {
      Logger.error('Statistics', new Error(`${this._id} is attempting to add a non-finite number (${value}) to ${stat}. Fix it!`));
      return;
    }
    let val = _.get(this.stats, stat, 0);
    const oldVal = val;
    val += value;
    if(_.isNaN(val)) val = _.isNaN(oldVal) ? 0 : oldVal;
    _.set(this.stats, stat, val);
  }

  setStat(stat, value = 1) {
    if(!_.isFinite(value) || !_.isNumber(value)) {
      Logger.error('Statistics', new Error(`${this._id} is attempting to set a non-finite number (${value}) to ${stat}. Fix it!`));
      return;
    }
    _.set(this.stats, stat, value);
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
