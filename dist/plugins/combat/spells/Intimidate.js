"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const Intimidate_1 = require("../effects/Intimidate");
class Intimidate extends spell_1.Spell {
    static shouldCast(caster) {
        return caster._special.gtePercent(25) && this.$canTarget.enemyWithoutEffect(caster, 'Intimidate');
    }
    determineTargets() {
        return this.$targetting.randomEnemyWithoutEffect('Intimidate');
    }
    calcPotency() {
        return this.spellPower * 100;
    }
    calcDuration() {
        return 3 + this.spellPower;
    }
    preCast() {
        const message = '%player starts to %spellName %targetName!';
        const targets = this.determineTargets();
        this.caster._special.sub(25);
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: Intimidate_1.Intimidate,
                targets: [target]
            });
        });
    }
}
Intimidate.description = 'A spell that costs rage to make an enemy vulnerable to crits.';
Intimidate.element = spell_1.SpellType.DEBUFF;
Intimidate.tiers = [
    { name: 'intimidate', spellPower: 1, weight: 15, cost: 0, level: 1, profession: 'Barbarian' },
    { name: 'terrorize', spellPower: 4, weight: 15, cost: 0, level: 50, profession: 'Barbarian' }
];
exports.Intimidate = Intimidate;
