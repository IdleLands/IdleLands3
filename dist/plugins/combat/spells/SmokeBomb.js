"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const DEXLoss_1 = require("../effects/DEXLoss");
class SmokeBomb extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'DEXLoss');
    }
    determineTargets() {
        return this.$targetting.allEnemies;
    }
    calcDuration() {
        return 2 + this.spellPower;
    }
    calcPotency() {
        return 25 * this.spellPower;
    }
    preCast() {
        const message = '%player throws a %spellName at %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: DEXLoss_1.DEXLoss,
                targets: [target]
            });
        });
    }
}
SmokeBomb.description = 'Throws a bomb that reduces DEX of all enemies.';
SmokeBomb.element = spell_1.SpellType.DEBUFF;
SmokeBomb.tiers = [
    { name: 'smoke bomb', spellPower: 1, weight: 25, cost: 100, profession: 'Archer', level: 5 },
    { name: 'smoke grenade', spellPower: 2, weight: 25, cost: 500, profession: 'Archer', level: 35 },
    { name: 'smoke missile', spellPower: 3, weight: 25, cost: 1500, profession: 'Archer', level: 85 }
];
exports.SmokeBomb = SmokeBomb;
