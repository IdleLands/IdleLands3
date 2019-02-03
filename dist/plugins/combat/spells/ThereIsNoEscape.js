"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const DEXBoostValue_1 = require("../effects/DEXBoostValue");
const AGIBoostValue_1 = require("../effects/AGIBoostValue");
class ThereIsNoEscape extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'DEXBoostValue') && this.$canTarget.allyWithoutEffect(caster, 'AGIBoostValue');
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
                applyEffect: DEXBoostValue_1.DEXBoostValue,
                applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.dex * this.spellPower / 100)),
                applyEffectName: `${this.tier.name} (DEX)`,
                targets: [target]
            });
            super.cast({
                damage: 0,
                message: '',
                applyEffect: AGIBoostValue_1.AGIBoostValue,
                applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.agi * this.spellPower / 100)),
                applyEffectName: `${this.tier.name} (AGI)`,
                targets: [target]
            });
        });
    }
}
ThereIsNoEscape.description = 'A buff that increases DEX and AGI of all allies.';
ThereIsNoEscape.element = spell_1.SpellType.BUFF;
ThereIsNoEscape.tiers = [
    { name: 'There Is No Escape', spellPower: 15, weight: 25, cost: 200, profession: 'Bard', level: 1 },
    { name: 'You Shant Get Away', spellPower: 30, weight: 25, cost: 2000, profession: 'Bard', level: 50 }
];
exports.ThereIsNoEscape = ThereIsNoEscape;
