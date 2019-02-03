"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class DamageReductionPercentBoost extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'damageReductionPercent', this.potency);
    }
}
exports.DamageReductionPercentBoost = DamageReductionPercentBoost;
