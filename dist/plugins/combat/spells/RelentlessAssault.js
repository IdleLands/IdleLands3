"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const RelentlessAssault_1 = require("../effects/RelentlessAssault");
class RelentlessAssault extends spell_1.Spell {
    static shouldCast(caster) {
        return caster._special.gtePercent(70);
    }
    determineTargets() {
        return this.$targetting.self;
    }
    calcDuration() {
        return 10;
    }
    calcPotency() {
        return 1;
    }
    preCast() {
        const message = '%player begins a %spellName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: RelentlessAssault_1.RelentlessAssault,
                targets: [target]
            });
        });
    }
}
RelentlessAssault.description = 'Performs two additional Attacks per round, costing 25 Focus each round for 10 rounds.';
RelentlessAssault.element = spell_1.SpellType.PHYSICAL;
RelentlessAssault.stat = 'special';
RelentlessAssault.tiers = [
    { name: 'relentless assault', spellPower: 1, weight: 30, cost: 0, level: 50, profession: 'Archer' }
];
exports.RelentlessAssault = RelentlessAssault;
