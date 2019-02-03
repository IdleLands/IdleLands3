"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const stat_calculator_1 = require("../../shared/stat-calculator");
class DirtyChecker {
    constructor() {
        this._flags = {};
        _.each(stat_calculator_1.ALL_STATS.concat(['itemFindRange', 'itemFindRangeMultiplier']), stat => this._flags[stat] = true);
        this.flags = new Proxy({}, {
            get: (target, name) => {
                return this._flags[name];
            },
            set: (target, name) => {
                this._flags[name] = name;
                return true;
            }
        });
    }
    reset() {
        _.each(_.keys(this._flags), flag => this._flags[flag] = false);
    }
}
exports.DirtyChecker = DirtyChecker;
