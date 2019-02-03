"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class Byte extends spell_1.Spell {
    static shouldCast() {
        return this.$canTarget.yes();
    }
    calcDamage() {
        const min = this.caster.liveStats.int / 10;
        const max = this.caster.liveStats.int / 5;
        return this.minMax(min, max) * this.spellPower;
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    preCast() {
        const targets = this.determineTargets();
        _.each(targets, target => {
            const damage = this.calcDamage();
            const healed = Math.round(damage / 5);
            const message = `%player cast %spellName at %targetName and dealt %damage damage! %player gained ${healed} hp!`;
            this.caster.$battle.healDamage(this.caster, healed, target);
            super.cast({
                damage,
                message,
                targets: [target]
            });
        });
    }
}
Byte.description = 'A spell that uses INT to deal damage to an enemy and heal the caster.';
Byte.element = spell_1.SpellType.DIGITAL;
Byte.stat = 'special';
Byte.tiers = [
    { name: 'byte', spellPower: 1, weight: 40, cost: 1, level: 1, profession: 'Bitomancer' },
    { name: 'kilobyte', spellPower: 2, weight: 40, cost: 16, level: 8, profession: 'Bitomancer' },
    { name: 'megabyte', spellPower: 3, weight: 40, cost: 64, level: 16, profession: 'Bitomancer' },
    { name: 'gigabyte', spellPower: 4, weight: 40, cost: 128, level: 32, profession: 'Bitomancer' },
    { name: 'terabyte', spellPower: 5, weight: 40, cost: 256, level: 64, profession: 'Bitomancer' },
    { name: 'petabyte', spellPower: 6, weight: 40, cost: 512, level: 128, profession: 'Bitomancer',
        collectibles: ['Giant Sized Flask'] }
];
exports.Byte = Byte;
