"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class OpeningStrike extends spell_1.Spell {
    static shouldCast(caster) {
        return caster.$lastComboSkillTurn <= 0;
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    calcDamage() {
        const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.25;
        const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.5;
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
OpeningStrike.description = 'An attack that uses STR and DEX to deal damage.';
OpeningStrike.element = spell_1.SpellType.PHYSICAL;
OpeningStrike.stat = 'special';
OpeningStrike.tiers = [
    { name: 'opening strike', spellPower: 1, weight: 30, cost: 10, level: 1, profession: 'Rogue' },
    { name: 'opening strike', spellPower: 2, weight: 30, cost: 10, level: 61, profession: 'Rogue' }
];
exports.OpeningStrike = OpeningStrike;
