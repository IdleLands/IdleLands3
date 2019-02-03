"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const effect_1 = require("../effect");
class PhysicalStatBoost extends effect_1.Effect {
    affect(target) {
        _.each(['str', 'dex', 'agi'], stat => {
            this.setStat(target, stat, this.statByPercent(target, stat, this.potency));
        });
    }
}
exports.PhysicalStatBoost = PhysicalStatBoost;
