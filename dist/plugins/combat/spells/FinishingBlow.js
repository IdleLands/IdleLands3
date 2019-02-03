"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class FinishingBlow extends spell_1.Spell {
    static shouldCast(caster) {
        return _.includes(['wombo combo', 'savage stab', 'heartbleed'], caster.$lastComboSkill);
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    calcDamage() {
        const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 1.45;
        const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 2.25;
        return this.minMax(min, max) * this.spellPower;
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
        });
    }
}
FinishingBlow.description = 'A combo attack that follows Wombo Combo, Savage Stab, or Heartbleed.';
FinishingBlow.element = spell_1.SpellType.PHYSICAL;
FinishingBlow.stat = 'special';
FinishingBlow.tiers = [
    { name: 'finishing blow', spellPower: 1, weight: 30, cost: 30, level: 38, profession: 'Rogue' },
    { name: 'finishing blow', spellPower: 2, weight: 30, cost: 30, level: 98, profession: 'Rogue' }
];
exports.FinishingBlow = FinishingBlow;
