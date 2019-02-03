"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class Thunderstrike extends effect_1.Effect {
    tick() {
        super.tick();
        this._emitMessage(this.target, 'A storm brews over %player...');
    }
    unaffect() {
        const damage = this.potency * this._duration;
        this.dealDamage(this.target, damage, '%player got struck by %casterName\'s %spellName and took %damage damage!');
    }
}
exports.Thunderstrike = Thunderstrike;
