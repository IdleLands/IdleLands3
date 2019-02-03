"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class VenomCoating extends effect_1.Effect {
    affect(target) {
        this.setStat(target, 'venom', this.potency);
        this.setStat(target, 'poison', this.potency * 2);
    }
}
exports.VenomCoating = VenomCoating;
