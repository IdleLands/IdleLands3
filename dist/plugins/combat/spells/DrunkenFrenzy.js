"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class DrunkenFrenzy extends spell_1.Spell {
    static shouldCast(caster) {
        return caster.$effects.hasEffect('DrunkenStupor') || caster.$drunk.gtePercent(65);
    }
    calcDamage() {
        const drunkMultiplier = this.caster.$personalities && this.caster.$personalities.isActive('Drunk') ? 2 : 1;
        const min = this.caster.liveStats.str * 0.75 * drunkMultiplier;
        const max = this.caster.liveStats.str * 1.5 * drunkMultiplier;
        return this.minMax(min, max) * this.spellPower;
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    preCast() {
        const message = '%player went off on a %spellName at %targetName and dealt %damage damage!';
        const targets = this.determineTargets();
        this.caster._special.add(spell_1.Spell.chance.integer({ min: 30, max: 40 }));
        this.caster.$drunk.sub(10);
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
DrunkenFrenzy.description = 'Drunkenly ravages a random enemy, dealing 2x damage if the personality Drunk is activated. Reduces drunkenness by 10% and replenishes bottle count by 30-40.';
DrunkenFrenzy.element = spell_1.SpellType.PHYSICAL;
DrunkenFrenzy.tiers = [
    { name: 'drunken frenzy', spellPower: 1, weight: 60, cost: 0, level: 30, profession: 'Pirate' }
];
exports.DrunkenFrenzy = DrunkenFrenzy;
