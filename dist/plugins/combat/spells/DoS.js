"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const DoS_1 = require("../effects/DoS");
class DoS extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyNotProfession(caster, 'Bitomancer') && this.$canTarget.enemyWithoutEffect(caster, 'DoS');
    }
    determineTargets() {
        return this.$targetting.randomEnemyNotProfession('Bitomancer');
    }
    calcDuration() {
        return 2 + this.spellPower;
    }
    calcPotency() {
        return this.spellPower * 30;
    }
    preCast() {
        const message = '%player executed a %spellName attack on %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: DoS_1.DoS,
                targets: [target]
            });
        });
    }
}
DoS.description = 'A spell that causes an enemy to drop packets on some rounds, ending their turn.';
DoS.element = spell_1.SpellType.DIGITAL;
DoS.stat = 'special';
DoS.tiers = [
    { name: 'DoS', spellPower: 1, weight: 40, cost: 64, level: 32, profession: 'Bitomancer' },
    { name: 'DDoS', spellPower: 2, weight: 40, cost: 128, level: 64, profession: 'Bitomancer' },
    { name: 'persistent DDoS', spellPower: 3, weight: 40, cost: 512, level: 128, profession: 'Bitomancer',
        collectibles: ['Gauntlet'] }
];
exports.DoS = DoS;
