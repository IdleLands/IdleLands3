"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const StillAngry_1 = require("../effects/StillAngry");
class Résumé extends spell_1.Spell {
    static shouldCast(caster) {
        return caster._hp.lessThanPercent(25) && this.$canTarget.enemyWithoutEffect(caster, 'StillAngry');
    }
    determineTargets() {
        return this.$targetting.randomEnemyWithoutEffect('StillAngry');
    }
    calcDamage() {
        return 0;
    }
    calcPotency() {
        return 100;
    }
    calcDuration() {
        return 1;
    }
    preCast() {
        let message = 'Out of desperation, %player gave a %spellName to %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            const goldRequired = this.caster.level * 100;
            const castOpts = {
                damage: 0,
                targets: [target]
            };
            if (target.gold > goldRequired) {
                message = `${message} %targetName hired %player and gave %himher a part-time gig! [+${goldRequired} gold]`;
                target.gainGold(-goldRequired, false);
                this.caster.gainGold(goldRequired, false);
            }
            else {
                message = `${message} %targetName declined, and got shoved into the ground by %player!`;
                castOpts.applyEffect = StillAngry_1.StillAngry;
            }
            castOpts.message = message;
            super.cast(castOpts);
        });
    }
}
Résumé.element = spell_1.SpellType.PHYSICAL;
Résumé.tiers = [
    { name: 'résumé', spellPower: 1, weight: 30, cost: 10, level: 1, profession: 'SandwichArtist' }
];
exports.Résumé = Résumé;
