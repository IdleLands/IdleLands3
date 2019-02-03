"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class WomboCombo extends spell_1.Spell {
    static shouldCast(caster) {
        return _.includes(['chain stab', 'heartbleed'], caster.$lastComboSkill);
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    calcDamage() {
        const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.5;
        const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.8;
        return this.minMax(min, max) * this.spellPower;
    }
    preCast() {
        this.caster.$profession.updateSkillCombo(this.caster, this.tier.name);
        const message = '%player used %spellName on %targetName and dealt %damage damage!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            for (let i = 0; i < 3; i++) {
                const damage = this.calcDamage();
                super.cast({
                    damage,
                    message,
                    targets: [target]
                });
            }
        });
    }
}
WomboCombo.description = 'A three-hit combo attack that follows Chain Stab or Heartbleed.';
WomboCombo.element = spell_1.SpellType.PHYSICAL;
WomboCombo.stat = 'special';
WomboCombo.tiers = [
    { name: 'wombo combo', spellPower: 1, weight: 30, cost: 25, level: 25, profession: 'Rogue' },
    { name: 'wombo combo', spellPower: 2, weight: 30, cost: 25, level: 85, profession: 'Rogue' }
];
exports.WomboCombo = WomboCombo;
