"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effect_1 = require("../effect");
class Heartbleed extends effect_1.Effect {
    affect() {
        this._emitMessage(this.target, '%player\'s heart begins bleeding!');
    }
    tick() {
        super.tick();
        const damage = Math.round(this.target._hp.__current * 0.07);
        const message = '%player suffered %damage damage from %casterName\'s %spellName!';
        this.dealDamage(this.target, damage, message);
    }
}
exports.Heartbleed = Heartbleed;
