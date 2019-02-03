"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class INTBoost extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'int', this.statByPercent(target, 'int', this.potency));
    }
}
exports.INTBoost = INTBoost;
