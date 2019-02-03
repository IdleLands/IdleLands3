"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const DamageReductionBoost_1 = require("../effects/DamageReductionBoost");
class EnergyWall extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'DamageReductionBoost');
    }
    determineTargets() {
        return this.$targetting.allAllies;
    }
    calcDuration() {
        return 3;
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
                applyEffect: DamageReductionBoost_1.DamageReductionBoost,
                targets: [target]
            });
        });
    }
}
EnergyWall.description = 'A buff that reduces damage taken by an ally.';
EnergyWall.element = spell_1.SpellType.BUFF;
EnergyWall.tiers = [
    { name: 'energy barrier', spellPower: 100, weight: 25, cost: 300, profession: 'Generalist', level: 15 },
    { name: 'energy barricade', spellPower: 300, weight: 25, cost: 1100, profession: 'Generalist', level: 45 },
    { name: 'energy wall', spellPower: 900, weight: 25, cost: 2500, profession: 'Generalist', level: 95 },
    { name: 'energy greatwall', spellPower: 4500, weight: 25, cost: 9000, profession: 'Generalist', level: 165,
        collectibles: ['Jar of Magic Dust'] }
];
exports.EnergyWall = EnergyWall;
