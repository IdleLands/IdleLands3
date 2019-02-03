"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const effect_1 = require("../effect");
class PoisonedSandwich extends effect_1.Effect {
    affect(target) {
        const newStats = _.pick(this.extra, ['str', 'dex', 'con', 'agi', 'int', 'luk']);
        _.each(newStats, (val, stat) => {
            this.setStat(target, stat, val);
        });
    }
    tick() {
        super.tick();
        const damage = Math.round(this.potency);
        const message = '%player suffered %damage damage from %casterName\'s %spellName!';
        this.dealDamage(this.target, damage, message);
    }
}
exports.PoisonedSandwich = PoisonedSandwich;
