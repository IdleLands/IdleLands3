"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
// copy-paste because this effect is way more important than a normal DR skill
class Tranquility extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'damageReduction', this.potency);
    }
}
exports.Tranquility = Tranquility;
