"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class Vampire extends effect_1.Effect {
    constructor(opts) {
        if (!opts.duration)
            opts.duration = 3;
        super(opts);
    }
    affect() {
        this._emitMessage(this.target, '%player is slowly being drained of %hisher hp!');
    }
    tick() {
        super.tick();
        let damage = Math.round(this.target.hp * 0.01 * Math.min(this.potency, 5));
        if (this.target.$isBoss) {
            damage = Math.round(damage / 4);
        }
        const casterAlive = this.origin.ref.hp !== 0;
        const message = `%player suffered %damage damage from %casterName's %spellName! ${casterAlive ? '%casterName leeched it back!' : ''}`;
        const dealtDamage = this.dealDamage(this.target, damage, message);
        if (casterAlive) {
            this.target.$battle.healDamage(this.origin.ref, dealtDamage, this.target);
        }
    }
}
exports.Vampire = Vampire;
