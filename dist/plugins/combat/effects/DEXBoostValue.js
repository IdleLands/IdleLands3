"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class DEXBoostValue extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'dex', this.potency);
    }
}
exports.DEXBoostValue = DEXBoostValue;
