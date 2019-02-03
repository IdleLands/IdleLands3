"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class Backstab extends spell_1.Spell {
    static shouldCast(caster) {
        return _.includes(['opening strike'], caster.$lastComboSkill);
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    calcDamage() {
        const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.7;
        const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 1.1;
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
Backstab.description = 'A combo attack that follows Opening Strike.';
Backstab.element = spell_1.SpellType.PHYSICAL;
Backstab.stat = 'special';
Backstab.tiers = [
    { name: 'backstab', spellPower: 1, weight: 30, cost: 15, level: 8, profession: 'Rogue' },
    { name: 'backstab', spellPower: 2, weight: 30, cost: 15, level: 68, profession: 'Rogue' }
];
exports.Backstab = Backstab;
