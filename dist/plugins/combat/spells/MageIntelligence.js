"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const INTBoost_1 = require("../effects/INTBoost");
class MageIntelligence extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'INTBoost');
    }
    determineTargets() {
        return this.$targetting.randomAllyWithoutEffectAndPrioritizeCaster('INTBoost');
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
                applyEffect: INTBoost_1.INTBoost,
                targets: [target]
            });
        });
    }
}
MageIntelligence.description = 'A buff that increases INT of an ally.';
MageIntelligence.element = spell_1.SpellType.BUFF;
MageIntelligence.tiers = [
    { name: 'magic intelligence', spellPower: 15, weight: 25, cost: 200, profession: 'Mage', level: 15 },
    { name: 'magic brilliance', spellPower: 30, weight: 25, cost: 400, profession: 'Mage', level: 30 },
    { name: 'arcane intelligence', spellPower: 60, weight: 25, cost: 700, profession: 'Mage', level: 60 },
    { name: 'arcane brilliance', spellPower: 120, weight: 25, cost: 1100, profession: 'Mage', level: 95 }
];
exports.MageIntelligence = MageIntelligence;
