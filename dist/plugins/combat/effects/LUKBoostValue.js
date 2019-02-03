"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class LUKBoostValue extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'luk', this.potency);
    }
}
exports.LUKBoostValue = LUKBoostValue;
