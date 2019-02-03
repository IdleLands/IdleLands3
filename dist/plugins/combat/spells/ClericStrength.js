"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const STRBoost_1 = require("../effects/STRBoost");
class ClericStrength extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'STRBoost');
    }
    determineTargets() {
        return this.$targetting.randomAllyWithoutEffect('STRBoost');
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
                applyEffect: STRBoost_1.STRBoost,
                targets: [target]
            });
        });
    }
}
ClericStrength.description = 'A buff that increases an ally\'s STR';
ClericStrength.element = spell_1.SpellType.BUFF;
ClericStrength.tiers = [
    { name: 'boar strength', spellPower: 15, weight: 25, cost: 200, profession: 'Cleric', level: 15 },
    { name: 'demon strength', spellPower: 30, weight: 25, cost: 400, profession: 'Cleric', level: 30 },
    { name: 'dragon strength', spellPower: 60, weight: 25, cost: 700, profession: 'Cleric', level: 60 },
    { name: 'titan strength', spellPower: 120, weight: 25, cost: 1100, profession: 'Cleric', level: 95 }
];
exports.ClericStrength = ClericStrength;
