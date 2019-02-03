"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class Cleave extends spell_1.Spell {
    static shouldCast(caster) {
        return caster._special.gtePercent(30);
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    calcDamage() {
        const min = this.caster.liveStats.str * 2;
        const max = this.caster.liveStats.str * 3;
        return this.minMax(min, max) * this.spellPower;
    }
    preCast() {
        const message = '%player used %spellName on %targetName and dealt %damage damage!';
        const targets = this.determineTargets();
        this.caster._special.toMinimum();
        _.each(targets, target => {
            const damage = this.calcDamage();
            super.cast({
                damage,
                message,
                targets: [target]
            });
        });
    }
}
Cleave.description = 'An attack that consumes all Rage to deal massive damage.';
Cleave.element = spell_1.SpellType.PHYSICAL;
Cleave.tiers = [
    { name: 'cleave', spellPower: 1, weight: 30, cost: 0, level: 50, profession: 'Barbarian' }
];
exports.Cleave = Cleave;
