"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class Bit extends spell_1.Spell {
    static shouldCast() {
        return this.$canTarget.yes();
    }
    calcDamage() {
        const min = this.caster.liveStats.int / 6;
        const max = this.caster.liveStats.int / 2;
        return this.minMax(min, max) * this.spellPower;
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    preCast() {
        const message = '%player cast %spellName at %targetName and dealt %damage damage!';
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
Bit.description = 'A spell that uses INT to deal damage.';
Bit.element = spell_1.SpellType.DIGITAL;
Bit.stat = 'special';
Bit.tiers = [
    { name: 'bit', spellPower: 1, weight: 40, cost: 1, level: 1, profession: 'Bitomancer' },
    { name: 'kilobit', spellPower: 2, weight: 40, cost: 16, level: 8, profession: 'Bitomancer' },
    { name: 'megabit', spellPower: 3, weight: 40, cost: 64, level: 16, profession: 'Bitomancer' },
    { name: 'gigabit', spellPower: 4, weight: 40, cost: 128, level: 32, profession: 'Bitomancer' },
    { name: 'terabit', spellPower: 5, weight: 40, cost: 256, level: 64, profession: 'Bitomancer' },
    { name: 'petabit', spellPower: 6, weight: 40, cost: 512, level: 128, profession: 'Bitomancer',
        collectibles: ['Steel Flower'] }
];
exports.Bit = Bit;
