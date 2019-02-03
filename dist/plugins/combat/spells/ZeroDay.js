"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const ZeroDay_1 = require("../effects/ZeroDay");
class ZeroDay extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyNotProfession(caster, 'Bitomancer') && this.$canTarget.enemyWithoutEffect(caster, 'ZeroDay');
    }
    determineTargets() {
        return this.$targetting.randomEnemyNotProfession('Bitomancer');
    }
    calcDuration() {
        return 2 + this.spellPower;
    }
    calcPotency() {
        return this.spellPower * 100;
    }
    preCast() {
        const message = '%player executed a %spellName on %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: ZeroDay_1.ZeroDay,
                targets: [target]
            });
        });
    }
}
ZeroDay.description = 'A spell that increases the damage that an enemy takes.';
ZeroDay.element = spell_1.SpellType.DIGITAL;
ZeroDay.stat = 'special';
ZeroDay.tiers = [
    { name: 'zero-day threat', spellPower: 1, weight: 40, cost: 64, level: 32, profession: 'Bitomancer' },
    { name: 'zero-day attack', spellPower: 5, weight: 40, cost: 128, level: 64, profession: 'Bitomancer' },
    { name: 'zero-day assault', spellPower: 10, weight: 40, cost: 512, level: 128, profession: 'Bitomancer',
        collectibles: ['Vial of Liquid Fate'] }
];
exports.ZeroDay = ZeroDay;
