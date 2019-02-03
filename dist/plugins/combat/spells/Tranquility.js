"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const Tranquility_1 = require("../effects/Tranquility");
class Tranquility extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'Tranquility');
    }
    determineTargets() {
        // Tranquility is special and can target dead players.
        return this.$targetting.all;
    }
    calcDuration() {
        return 2;
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
                applyEffect: Tranquility_1.Tranquility,
                targets: [target]
            });
        });
    }
}
Tranquility.description = 'A buff that massively reduces damage taken by all targets for two turns.';
Tranquility.element = spell_1.SpellType.BUFF;
Tranquility.tiers = [
    { name: 'tranquility', spellPower: 1000000, weight: 25, cost: 10000, profession: 'Cleric', level: 75 }
];
exports.Tranquility = Tranquility;
