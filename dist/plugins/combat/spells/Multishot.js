"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class Multishot extends spell_1.Spell {
    static shouldCast() {
        return this.$canTarget.yes();
    }
    calcDamage() {
        const min = this.caster.liveStats.dex * 0.25;
        const max = this.caster.liveStats.dex * 0.50;
        return this.minMax(min, max);
    }
    determineTargets() {
        return this.$targetting.randomEnemies(this.spellPower);
    }
    preCast() {
        const message = '%player used %spellName on %targetName and dealt %damage damage!';
        const targets = this.determineTargets();
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
Multishot.description = 'An attack that hits multiple times.';
Multishot.element = spell_1.SpellType.PHYSICAL;
Multishot.stat = 'special';
Multishot.tiers = [
    { name: 'double shot', spellPower: 2, weight: 40, cost: 20, level: 25, profession: 'Archer' },
    { name: 'triple shot', spellPower: 3, weight: 40, cost: 30, level: 55, profession: 'Archer' },
    { name: 'quadruple shot', spellPower: 4, weight: 40, cost: 40, level: 85, profession: 'Archer' }
];
exports.Multishot = Multishot;
