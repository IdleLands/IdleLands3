"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const DamageReductionPercentBoost_1 = require("../effects/DamageReductionPercentBoost");
class EnergyShield extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'DamageReductionPercentBoost');
    }
    determineTargets() {
        return this.$targetting.randomAllyWithoutEffect('DamageReductionPercentBoost');
    }
    calcDuration() {
        return 5;
    }
    calcPotency() {
        return this.spellPower;
    }
    preCast() {
        const message = '%player cast %spellName on %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: DamageReductionPercentBoost_1.DamageReductionPercentBoost,
                targets: [target]
            });
        });
    }
}
EnergyShield.description = 'A buff that reduces damage taken by an ally.';
EnergyShield.element = spell_1.SpellType.BUFF;
EnergyShield.tiers = [
    { name: 'energy shield', spellPower: 5, weight: 25, cost: 400, profession: 'Mage', level: 5 },
    { name: 'energy buckler', spellPower: 7, weight: 25, cost: 3000, profession: 'Mage', level: 25 },
    { name: 'energy towershield', spellPower: 10, weight: 25, cost: 14000, profession: 'Mage', level: 65 },
    { name: 'energy omegashield', spellPower: 15, weight: 25, cost: 80000, profession: 'Mage', level: 125,
        collectibles: ['Jar of Magic Dust'] }
];
exports.EnergyShield = EnergyShield;
