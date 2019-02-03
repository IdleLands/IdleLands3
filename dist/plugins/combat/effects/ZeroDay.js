"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class ZeroDay extends effect_1.Effect {
    affect() {
        this.damageReduction = -this.potency;
    }
}
exports.ZeroDay = ZeroDay;
