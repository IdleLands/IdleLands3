"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const DEXBoost_1 = require("../effects/DEXBoost");
class GrogDance extends spell_1.Spell {
    static shouldCast(caster) {
        return !caster.$effects.hasEffect('DEXBoost') && caster._special.ltePercent(30) && !caster.$effects.hasEffect('DrunkenStupor');
    }
    determineTargets() {
        return this.$targetting.self;
    }
    calcDuration() {
        return 3;
    }
    calcPotency() {
        return this.caster._special.maximum - this.caster.special;
    }
    preCast() {
        const message = '%player does a %spellName!';
        const targets = this.determineTargets();
        this.caster._special.add(spell_1.Spell.chance.integer({ min: 15, max: 45 }));
        this.caster.$drunk.add(25);
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: DEXBoost_1.DEXBoost,
                targets: [target]
            });
        });
    }
}
GrogDance.description = 'Dances like a pirate, increasing DEX and replenishing bottle count by 15-45. Also increases drunkenness by 25%';
GrogDance.element = spell_1.SpellType.PHYSICAL;
GrogDance.stat = 'special';
GrogDance.tiers = [
    { name: 'grog dance', spellPower: 1, weight: 25, cost: 0, profession: 'Pirate', level: 37 }
];
exports.GrogDance = GrogDance;
