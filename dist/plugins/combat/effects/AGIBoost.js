"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class AGIBoost extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'agi', this.statByPercent(target, 'agi', this.potency));
    }
}
exports.AGIBoost = AGIBoost;
