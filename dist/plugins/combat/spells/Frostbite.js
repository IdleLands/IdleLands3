"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const Frostbite_1 = require("../effects/Frostbite");
class Frostbite extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'Frostbite');
    }
    determineTargets() {
        return this.$targetting.randomEnemyWithoutEffect('Frostbite');
    }
    calcDamage() {
        const min = this.caster.liveStats.int / 4;
        const max = this.caster.liveStats.int / 3;
        return this.minMax(min, max) * this.spellPower;
    }
    calcPotency() {
        return this.spellPower * 25;
    }
    calcDuration() {
        return 2 + this.spellPower;
    }
    preCast() {
        const message = '%player cast %spellName at %targetName and dealt %damage damage!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            const damage = this.calcDamage();
            super.cast({
                damage,
                message,
                applyEffect: Frostbite_1.Frostbite,
                targets: [target]
            });
        });
    }
}
Frostbite.description = 'A spell that causes an enemy to be frostbitten on some turns.';
Frostbite.element = spell_1.SpellType.ICE;
Frostbite.tiers = [
    { name: 'frostbite', spellPower: 1, weight: 40, cost: 300, level: 15, profession: 'Mage' },
    { name: 'cold snap', spellPower: 2, weight: 40, cost: 900, level: 65, profession: 'Mage' }
];
exports.Frostbite = Frostbite;
