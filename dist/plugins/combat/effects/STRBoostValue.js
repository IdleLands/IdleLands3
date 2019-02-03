"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class STRBoostValue extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'str', this.potency);
    }
}
exports.STRBoostValue = STRBoostValue;
