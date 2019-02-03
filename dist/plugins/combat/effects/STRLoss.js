"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class STRLoss extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'str', -this.statByPercent(target, 'str', this.potency));
    }
}
exports.STRLoss = STRLoss;
