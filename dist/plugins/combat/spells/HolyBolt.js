"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class HolyBolt extends spell_1.Spell {
    static shouldCast() {
        return this.$canTarget.yes();
    }
    calcDamage() {
        const min = this.caster.liveStats.int / 4;
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
HolyBolt.description = 'A spell that uses INT to deal damage.';
HolyBolt.element = spell_1.SpellType.HOLY;
HolyBolt.tiers = [
    { name: 'holy bolt', spellPower: 3, weight: 40, cost: 10, level: 1, profession: 'Cleric' },
    { name: 'divine bolt', spellPower: 5, weight: 40, cost: 300, level: 25, profession: 'Cleric' },
    { name: 'celestial bolt', spellPower: 7, weight: 40, cost: 1800, level: 55, profession: 'Cleric' }
];
exports.HolyBolt = HolyBolt;
