"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const sandwich_generator_1 = require("../../../shared/sandwich-generator");
const PoisonedSandwich_1 = require("../effects/PoisonedSandwich");
class PoisonedSandwich extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'PoisonedSandwich');
    }
    determineTargets() {
        return this.$targetting.randomEnemyWithoutEffect('PoisonedSandwich');
    }
    calcPotency() {
        const min = (this.caster.liveStats.dex + this.caster.liveStats.int) / 8;
        const max = (this.caster.liveStats.dex + this.caster.liveStats.int) / 4;
        return this.minMax(min, max) * this.spellPower;
    }
    calcDuration() {
        return this.spellPower;
    }
    preCast() {
        const targets = this.determineTargets();
        _.each(targets, target => {
            const sandwich = sandwich_generator_1.SandwichGenerator.generateSandwich(target);
            sandwich.name = `${this.tier.name} ${sandwich.name}`;
            sandwich.con -= this.spellPower * this.caster.level;
            const message = '%player served %targetName a %item, sickening %targetName!';
            const casterCon = this.caster.liveStats.con;
            const targetCon = target.liveStats.con;
            let durationBoost = 0;
            if (targetCon < casterCon)
                durationBoost++;
            if (targetCon < casterCon / 2)
                durationBoost++;
            if (targetCon < casterCon / 4)
                durationBoost++;
            super.cast({
                damage: 0,
                message,
                messageData: { item: sandwich.name },
                applyEffect: PoisonedSandwich_1.PoisonedSandwich,
                applyEffectExtra: sandwich,
                applyEffectName: sandwich.name,
                applyEffectDuration: this.calcDuration() + durationBoost,
                targets: [target]
            });
        });
    }
}
PoisonedSandwich.element = spell_1.SpellType.PHYSICAL;
PoisonedSandwich.tiers = [
    { name: 'poisoned', spellPower: 3, weight: 30, cost: 85, level: 15, profession: 'SandwichArtist' }
];
exports.PoisonedSandwich = PoisonedSandwich;
