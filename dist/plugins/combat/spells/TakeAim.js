"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class TakeAim extends spell_1.Spell {
    static shouldCast(caster) {
        return caster._special.ltePercent(50);
    }
    determineTargets() {
        return this.$targetting.self;
    }
    calcDamage() {
        return this.spellPower;
    }
    preCast() {
        const restoredFocus = this.calcDamage();
        const message = `%player used %spellName and recovered ${restoredFocus} focus!`;
        const targets = this.determineTargets();
        this.caster._special.add(restoredFocus);
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                targets: [target]
            });
        });
    }
}
TakeAim.description = 'Restores a set amount of Focus to the caster.';
TakeAim.element = spell_1.SpellType.PHYSICAL;
TakeAim.tiers = [
    { name: 'take aim', spellPower: 35, weight: 30, cost: 50, level: 7, profession: 'Archer' },
    { name: 'trance focus', spellPower: 70, weight: 30, cost: 250, level: 65, profession: 'Archer' }
];
exports.TakeAim = TakeAim;
