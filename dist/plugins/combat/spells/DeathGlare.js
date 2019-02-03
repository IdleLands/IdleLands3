"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const STRLoss_1 = require("../effects/STRLoss");
class DeathGlare extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'STRLoss') && !caster.$effects.hasEffect('DrunkenStupor');
    }
    determineTargets() {
        return this.$targetting.allEnemies;
    }
    calcDuration() {
        return 4 - (3 - Math.floor(this.caster.special / 33));
    }
    calcPotency() {
        return 20 + 3 * Math.floor(this.caster.special / 9);
    }
    preCast() {
        const message = '%player shoots a %spellName at %targetName!';
        const targets = this.determineTargets();
        this.caster.$drunk.add(15);
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: STRLoss_1.STRLoss,
                targets: [target]
            });
        });
    }
}
DeathGlare.description = 'Glares at a target, reducing STR of the entire enemy team. Lasts up to 4 turns and reduces up to 50 STR based on # of bottles.';
DeathGlare.element = spell_1.SpellType.DEBUFF;
DeathGlare.stat = 'special';
DeathGlare.tiers = [
    { name: 'death glare', spellPower: 1, weight: 25, cost: 9, profession: 'Pirate', level: 7 }
];
exports.DeathGlare = DeathGlare;
