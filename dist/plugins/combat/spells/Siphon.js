"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const AllStatsDown_1 = require("../effects/AllStatsDown");
class Siphon extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'AllStatsDown');
    }
    determineTargets() {
        return this.$targetting.randomEnemyWithoutEffect('AllStatsDown');
    }
    calcDamage() {
        const min = this.caster.liveStats.int / 8;
        const max = this.caster.liveStats.int / 4;
        return this.minMax(min, max) * this.spellPower;
    }
    calcDuration() {
        return 2 + this.spellPower;
    }
    calcPotency() {
        return 5 * this.spellPower;
    }
    preCast() {
        const targets = this.determineTargets();
        const message = '%player used %spellName on %targetName and siphoned %damage hp!';
        _.each(targets, target => {
            const damage = this.calcDamage();
            this.caster.$battle.healDamage(this.caster, damage, target);
            super.cast({
                damage,
                message,
                applyEffect: AllStatsDown_1.AllStatsDown,
                targets: [target]
            });
        });
    }
}
Siphon.description = 'A spell that uses INT to deal damage and heal the caster, with a debuff that decreases the target\'s STR, DEX, AGI, LUK, INT and CON.';
Siphon.element = spell_1.SpellType.DEBUFF;
Siphon.tiers = [
    { name: 'siphon', spellPower: 2, weight: 30, cost: 100, level: 1, profession: 'Necromancer' },
    { name: 'drain', spellPower: 3, weight: 30, cost: 500, level: 15, profession: 'Necromancer' },
    { name: 'deteriorate', spellPower: 4, weight: 30, cost: 3000, level: 35, profession: 'Necromancer' },
    { name: 'wither', spellPower: 5, weight: 30, cost: 7500, level: 75, profession: 'Necromancer' },
    { name: 'colander', spellPower: 1, weight: 30, cost: 1000, level: 35, profession: 'MagicalMonster',
        collectibles: ['Evil Pebble'] }
];
exports.Siphon = Siphon;
