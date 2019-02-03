"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class Retch extends spell_1.Spell {
    static shouldCast(caster) {
        return caster.$effects.hasEffect('DrunkenStupor') || caster.$drunk.gtePercent(75);
    }
    calcDamage() {
        const drunkMultiplier = this.caster.$personalities && this.caster.$personalities.isActive('Drunk') ? 2 : 1;
        const min = this.caster.liveStats.str * 0.50 * drunkMultiplier;
        const max = this.caster.liveStats.str * 0.75 * drunkMultiplier;
        return this.minMax(min, max) * this.spellPower;
    }
    determineTargets() {
        return this.$targetting.allEnemies;
    }
    preCast() {
        const message = '%player %spellName\'d all over %targetName and dealt %damage damage!';
        const targets = this.determineTargets();
        this.caster.$drunk.toMinimum();
        this.caster._special.add(spell_1.Spell.chance.integer({ min: 20, max: 30 }));
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
Retch.element = spell_1.SpellType.PHYSICAL;
Retch.tiers = [
    { name: 'retch', spellPower: 1, weight: 80, cost: 0, level: 40, profession: 'Pirate' },
    { name: 'vomit', spellPower: 2, weight: 80, cost: 0, level: 80, profession: 'Pirate' },
    { name: 'explosive vomit', spellPower: 3, weight: 80, cost: 0, level: 120, profession: 'Pirate',
        collectibles: ['Unpleasant Glass of Water'] }
];
exports.Retch = Retch;
