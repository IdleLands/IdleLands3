"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class CONBoostValue extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'con', this.potency);
    }
}
exports.CONBoostValue = CONBoostValue;
