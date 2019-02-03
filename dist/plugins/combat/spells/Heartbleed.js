"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const Heartbleed_1 = require("../effects/Heartbleed");
class Heartbleed extends spell_1.Spell {
    static shouldCast(caster) {
        return _.includes(['chain stab'], caster.$lastComboSkill);
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    calcDamage() {
        const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.15;
        const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.45;
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
                applyEffect: Heartbleed_1.Heartbleed,
                targets: [target]
            });
        });
    }
}
Heartbleed.description = 'A combo attack that follows Chain Stab. Applies a debuff to the target that deals damage every turn.';
Heartbleed.element = spell_1.SpellType.PHYSICAL;
Heartbleed.stat = 'special';
Heartbleed.tiers = [
    { name: 'heartbleed', spellPower: 1, weight: 30, cost: 15, level: 15, profession: 'Rogue' },
    { name: 'heartbleed', spellPower: 2, weight: 30, cost: 15, level: 75, profession: 'Rogue' }
];
exports.Heartbleed = Heartbleed;
