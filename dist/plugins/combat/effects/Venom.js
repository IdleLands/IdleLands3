"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class Venom extends effect_1.Effect {
    constructor(opts) {
        if (!opts.duration)
            opts.duration = 5;
        super(opts);
    }
    affect() {
        this._emitMessage(this.target, '%player had a dangerous venom injected into %hisher veins!');
    }
    tick() {
        super.tick();
        let damage = Math.round(this.target.hp * 0.02 * Math.min(this.potency, 5));
        if (this.target.$isBoss) {
            damage = Math.round(damage / 4);
        }
        const message = '%player suffered %damage damage from %casterName\'s %spellName!';
        this.dealDamage(this.target, damage, message);
    }
}
exports.Venom = Venom;
