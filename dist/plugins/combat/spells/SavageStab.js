"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const stat_calculator_1 = require("../../../shared/stat-calculator");
class SavageStab extends spell_1.Spell {
    static shouldCast(caster) {
        return _.includes(['wombo combo', 'heartbleed'], caster.$lastComboSkill);
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    calcDamage() {
        const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.15;
        const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.25;
        return this.minMax(min, max) * this.spellPower;
    }
    calcDuration() {
        return 2;
    }
    calcPotency() {
        return 1;
    }
    preCast() {
        this.caster.$profession.updateSkillCombo(this.caster, this.tier.name);
        const message = '%player used %spellName on %targetName and dealt %damage damage!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            const damage = this.calcDamage();
            super.cast({
                damage,
                message,
                targets: [target]
            });
            super.applyCombatEffects(stat_calculator_1.ATTACK_STATS, target);
        });
    }
}
SavageStab.element = spell_1.SpellType.PHYSICAL;
SavageStab.stat = 'special';
SavageStab.tiers = [
    { name: 'savage stab', spellPower: 1, weight: 30, cost: 30, level: 45, profession: 'Rogue' },
    { name: 'savage stab', spellPower: 2, weight: 30, cost: 30, level: 105, profession: 'Rogue',
        collectibles: ['Thief\'s Locket'] }
];
exports.SavageStab = SavageStab;
