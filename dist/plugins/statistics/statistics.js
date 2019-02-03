"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const constitute_1 = require("constitute");
const _ = require("lodash");
const logger_1 = require("../../shared/logger");
let Statistics = class Statistics {
    constructor(container) {
        const StatisticsDb = require('./statistics.db').StatisticsDb;
        try {
            container.schedulePostConstructor((statisticsDb) => {
                this.statisticsDb = statisticsDb;
            }, [StatisticsDb]);
        }
        catch (e) {
            logger_1.Logger.error('Statistics', e);
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
        if (!_.isObject(val) && !_.isFinite(val) || _.isNaN(val)) {
            val = 0;
            this.setStat(stat, 0);
            logger_1.Logger.error('Statistics', new Error(`${this._id} has infinity or NaN for ${stat}. Fix it!`));
        }
        return val;
    }
    _addStat(stat, value = 1) {
        if (!_.isFinite(value)) {
            logger_1.Logger.error('Statistics', new Error(`${this._id} is attempting to add a non-finite number (${value}) to ${stat}. Fix it!`));
            return;
        }
        let val = _.get(this.stats, stat, 0);
        const oldVal = val;
        val += value;
        if (_.isNaN(val))
            val = _.isNaN(oldVal) ? 0 : oldVal;
        _.set(this.stats, stat, val);
    }
    setStat(stat, value = 1) {
        if (!_.isFinite(value) || !_.isNumber(value)) {
            logger_1.Logger.error('Statistics', new Error(`${this._id} is attempting to set a non-finite number (${value}) to ${stat}. Fix it!`));
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
};
Statistics = __decorate([
    constitute_1.Dependencies(constitute_1.Container),
    __metadata("design:paramtypes", [Object])
], Statistics);
exports.Statistics = Statistics;
