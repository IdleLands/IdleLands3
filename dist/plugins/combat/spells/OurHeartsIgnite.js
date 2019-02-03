"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const STRBoostValue_1 = require("../effects/STRBoostValue");
const INTBoostValue_1 = require("../effects/INTBoostValue");
class OurHeartsIgnite extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'STRBoostValue') && this.$canTarget.allyWithoutEffect(caster, 'INTBoostValue');
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
        const message = '%player begins singing %spellName at %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: STRBoostValue_1.STRBoostValue,
                applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.str * this.spellPower / 100)),
                applyEffectName: `${this.tier.name} (STR)`,
                targets: [target]
            });
            super.cast({
                damage: 0,
                message: '',
                applyEffect: INTBoostValue_1.INTBoostValue,
                applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.int * this.spellPower / 100)),
                applyEffectName: `${this.tier.name} (INT)`,
                targets: [target]
            });
        });
    }
}
OurHeartsIgnite.description = 'A buff that increases STR and INT of all allies.';
OurHeartsIgnite.element = spell_1.SpellType.BUFF;
OurHeartsIgnite.tiers = [
    { name: 'Our Hearts Ignite', spellPower: 15, weight: 25, cost: 200, profession: 'Bard', level: 1 },
    { name: 'Our Hearts Blaze', spellPower: 30, weight: 25, cost: 2000, profession: 'Bard', level: 50 }
];
exports.OurHeartsIgnite = OurHeartsIgnite;
