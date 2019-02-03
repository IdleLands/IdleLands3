"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const effect_1 = require("../effect");
class AllStatsDown extends effect_1.Effect {
    affect(target) {
        _.each(['str', 'dex', 'agi', 'luk', 'int', 'con'], stat => {
            this.setStat(target, stat, -this.statByPercent(target, stat, this.potency));
        });
    }
}
exports.AllStatsDown = AllStatsDown;
