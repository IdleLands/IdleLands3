"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const VenomCoating_1 = require("../effects/VenomCoating");
class VenomCoating extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'VenomCoating') && caster._special.ltePercent(30);
    }
    determineTargets() {
        return this.$targetting.randomAllyWithoutEffect('VenomCoating');
    }
    calcDuration() {
        return 3 + this.spellPower;
    }
    calcPotency() {
        return this.spellPower;
    }
    preCast() {
        const message = '%player applied a %spellName on %targetName\'s weapon!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: VenomCoating_1.VenomCoating,
                targets: [target]
            });
        });
    }
}
VenomCoating.description = 'Applies Venom and Poison effects to an ally\'s weapon.';
VenomCoating.element = spell_1.SpellType.BUFF;
VenomCoating.tiers = [
    { name: 'venom coating', spellPower: 1, weight: 25, cost: 200, profession: 'Archer', level: 15 },
    { name: 'venom slathering', spellPower: 2, weight: 25, cost: 800, profession: 'Archer', level: 55 },
    { name: 'venom layer', spellPower: 1, weight: 25, cost: 600, profession: 'MagicalMonster', level: 35,
        collectibles: ['Feathered Cap'] }
];
exports.VenomCoating = VenomCoating;
