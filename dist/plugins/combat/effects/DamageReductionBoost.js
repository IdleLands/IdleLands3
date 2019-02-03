"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class DamageReductionBoost extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'damageReduction', this.potency);
    }
}
exports.DamageReductionBoost = DamageReductionBoost;
