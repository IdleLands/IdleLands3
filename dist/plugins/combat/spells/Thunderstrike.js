"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const Thunderstrike_1 = require("../effects/Thunderstrike");
class Thunderstrike extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'Thunderstrike');
    }
    determineTargets() {
        return this.$targetting.randomEnemyWithoutEffect('Thunderstrike');
    }
    calcDuration() {
        return spell_1.Spell.chance.integer({ min: 1, max: 3 }) + this.spellPower;
    }
    calcPotency() {
        const min = this.caster.liveStats.int / 8;
        const max = this.caster.liveStats.int / 4;
        return this.minMax(min, max) * this.spellPower;
    }
    preCast() {
        const message = '%player cast %spellName at %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: Thunderstrike_1.Thunderstrike,
                targets: [target]
            });
        });
    }
}
Thunderstrike.description = 'Summons a storm cloud that deals damage to an enemy after a number of rounds.';
Thunderstrike.element = spell_1.SpellType.THUNDER;
Thunderstrike.tiers = [
    { name: 'thunderstrike', spellPower: 2, weight: 40, cost: 500, level: 35, profession: 'Mage' },
    { name: 'thunderstorm', spellPower: 4, weight: 40, cost: 1500, level: 85, profession: 'Mage' }
];
exports.Thunderstrike = Thunderstrike;
