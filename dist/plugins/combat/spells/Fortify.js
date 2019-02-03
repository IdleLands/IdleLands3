"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const PhysicalStatBoost_1 = require("../effects/PhysicalStatBoost");
class Fortify extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'PhysicalStatBoost');
    }
    determineTargets() {
        return this.$targetting.allAllies;
    }
    calcDuration() {
        return Math.floor(this.spellPower / 2);
    }
    calcPotency() {
        return this.spellPower;
    }
    preCast() {
        const message = '%player cast %spellName on %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: PhysicalStatBoost_1.PhysicalStatBoost,
                targets: [target]
            });
        });
    }
}
Fortify.description = 'A buff that increases STR, DEX and AGI of an ally.';
Fortify.element = spell_1.SpellType.BUFF;
Fortify.tiers = [
    { name: 'fortify', spellPower: 10, weight: 25, cost: 200, profession: 'Generalist', level: 15 },
    { name: 'greater fortify', spellPower: 15, weight: 25, cost: 900, profession: 'Generalist', level: 45 },
    { name: 'ultimate fortify', spellPower: 20, weight: 25, cost: 2200, profession: 'Generalist', level: 90 }
];
exports.Fortify = Fortify;
