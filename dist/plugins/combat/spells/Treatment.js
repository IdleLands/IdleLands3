"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const PercentageHPHeal_1 = require("../effects/PercentageHPHeal");
class Treatment extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'PercentageHPHeal');
    }
    determineTargets() {
        return this.$targetting.randomAllyWithoutEffect('PercentageHPHeal');
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
                applyEffect: PercentageHPHeal_1.PercentageHPHeal,
                targets: [target]
            });
        });
    }
}
Treatment.element = spell_1.SpellType.BUFF;
Treatment.tiers = [
    { name: 'treatment', spellPower: 5, weight: 25, cost: 300, profession: 'Generalist', level: 20 },
    { name: 'greater treatment', spellPower: 10, weight: 25, cost: 1200, profession: 'Generalist', level: 60 },
    { name: 'ultimate treatment', spellPower: 15, weight: 25, cost: 2700, profession: 'Generalist', level: 120,
        collectibles: ['Doctor\'s Floating Device'] }
];
exports.Treatment = Treatment;
