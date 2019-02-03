"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class LitanyOfPain extends effect_1.Effect {
    tick() {
        super.tick();
        const damage = Math.round(this.potency);
        this.dealDamage(this.target, damage, '%player suffered %damage damage from %casterName\'s %spellName!');
    }
}
exports.LitanyOfPain = LitanyOfPain;
