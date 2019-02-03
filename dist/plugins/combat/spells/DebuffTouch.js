"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class DebuffTouch extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'Poison');
    }
    determineTargets() {
        return this.$targetting.randomEnemyWithoutEffect('Poison');
    }
    calcDamage(target) {
        if (this.spellPower < 4 || target.$isBoss)
            return 0;
        const min = target.hp * 0.15;
        const max = target.hp * 0.25;
        return this.minMax(min, max);
    }
    calcDuration() {
        return 3;
    }
    calcPotency() {
        return 1;
    }
    preCast() {
        const targets = this.determineTargets();
        const effects = ['poison'];
        if (this.spellPower > 1)
            effects.push('prone');
        if (this.spellPower > 2)
            effects.push('venom');
        _.each(targets, target => {
            const damage = this.calcDamage(target);
            let message = '%player used %spellName on %targetName!';
            if (damage > 0) {
                this.caster.$battle.healDamage(this.caster, damage, target);
                message = '%player used %spellName on %targetName and drained %damage hp!';
            }
            super.cast({
                damage,
                message,
                targets: [target]
            });
            super.applyCombatEffects(effects, target);
        });
    }
}
DebuffTouch.description = 'A debuff that may apply Poison, Prone and Venom effects.';
DebuffTouch.element = spell_1.SpellType.DEBUFF;
DebuffTouch.tiers = [
    { name: 'poisontouch', spellPower: 1, weight: 30, cost: 500, level: 15, profession: 'Necromancer' },
    { name: 'stuntouch', spellPower: 2, weight: 30, cost: 1700, level: 35, profession: 'Necromancer' },
    { name: 'venomtouch', spellPower: 3, weight: 30, cost: 3800, level: 55, profession: 'Necromancer' },
    { name: 'deathtouch', spellPower: 4, weight: 30, cost: 7500, level: 85, profession: 'Necromancer',
        collectibles: ['Forbidden Cleric\'s Text'] }
];
exports.DebuffTouch = DebuffTouch;
