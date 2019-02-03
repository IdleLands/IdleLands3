"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class AGIBoostValue extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'agi', this.potency);
    }
}
exports.AGIBoostValue = AGIBoostValue;
