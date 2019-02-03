"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class DEXLoss extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'dex', -this.statByPercent(target, 'dex', this.potency));
    }
}
exports.DEXLoss = DEXLoss;
