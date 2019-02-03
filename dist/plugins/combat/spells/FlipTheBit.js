"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class FlipTheBit extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.anyBitFlippable(caster);
    }
    determineTargets() {
        return this.$targetting.randomBitFlippable;
    }
    preCast() {
        const message = '%player executed %spellName on %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            const hp = target.hp;
            const mp = target.mp || 1;
            target._hp.set(mp);
            target._mp.set(hp);
            super.cast({
                damage: 0,
                message,
                targets: [target]
            });
        });
    }
}
FlipTheBit.description = 'A spell that reverses the target\'s current HP and MP values';
FlipTheBit.element = spell_1.SpellType.DIGITAL;
FlipTheBit.stat = 'special';
FlipTheBit.tiers = [
    { name: 'flip the bit', spellPower: 1, weight: 40, cost: 512, level: 1, profession: 'Bitomancer' }
];
exports.FlipTheBit = FlipTheBit;
