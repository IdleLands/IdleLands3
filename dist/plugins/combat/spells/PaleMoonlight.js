"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const PercentageHPHeal_1 = require("../effects/PercentageHPHeal");
class PaleMoonlight extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'PercentageHPHeal');
    }
    determineTargets() {
        return this.$targetting.allAllies;
    }
    calcDuration() {
        return 5;
    }
    calcPotency() {
        return this.spellPower;
    }
    preCast() {
        const message = '%player begins singing %spellName at %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: PercentageHPHeal_1.PercentageHPHeal,
                targets: [target]
            });
        });
    }
}
PaleMoonlight.description = 'A buff that heals all allies every turn.';
PaleMoonlight.element = spell_1.SpellType.BUFF;
PaleMoonlight.tiers = [
    { name: 'Through the Pale Moonlight', spellPower: 3, weight: 25, cost: 200, profession: 'Bard', level: 1 },
    { name: 'Shining Bright Against the Night', spellPower: 7.5, weight: 25, cost: 2000, profession: 'Bard', level: 50 }
];
exports.PaleMoonlight = PaleMoonlight;
