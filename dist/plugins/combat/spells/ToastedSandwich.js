"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const sandwich_generator_1 = require("../../../shared/sandwich-generator");
const Sandwich_1 = require("../effects/Sandwich");
class ToastedSandwich extends spell_1.Spell {
    static shouldCast() {
        return this.$canTarget.yes();
    }
    determineTargets() {
        return this.$targetting.randomEnemy;
    }
    calcDamage() {
        const min = (this.caster.liveStats.dex + this.caster.liveStats.int) / 8;
        const max = (this.caster.liveStats.dex + this.caster.liveStats.int) / 4;
        return this.minMax(min, max) * this.spellPower;
    }
    calcPotency() {
        return 1;
    }
    calcDuration() {
        return 2 + this.spellPower;
    }
    preCast() {
        const targets = this.determineTargets();
        _.each(targets, target => {
            let damage = 0;
            const sandwich = sandwich_generator_1.SandwichGenerator.generateSandwich(target);
            let message = '%player served %targetName a %item.';
            if (spell_1.Spell.chance.bool({ likelihood: 75 })) {
                sandwich.name = `${this.tier.name} ${sandwich.name}`;
                sandwich.con -= this.spellPower * 100;
                sandwich.dex -= this.spellPower * 100;
                sandwich.agi -= this.spellPower * 100;
                damage = this.calcDamage();
                message = `${message} %targetName wanted it toasted and got burned for %damage damage!`;
            }
            else {
                message = `${message} %targetName didn't want it toasted.`;
            }
            super.cast({
                damage,
                message,
                messageData: { item: sandwich.name },
                applyEffect: Sandwich_1.Sandwich,
                applyEffectExtra: sandwich,
                applyEffectName: sandwich.name,
                targets: [target]
            });
        });
    }
}
ToastedSandwich.element = spell_1.SpellType.FIRE;
ToastedSandwich.tiers = [
    { name: 'toasted', spellPower: 1, weight: 30, cost: 125, level: 10, profession: 'SandwichArtist' },
    { name: 'burnt', spellPower: 2, weight: 30, cost: 1300, level: 40, profession: 'SandwichArtist' },
    { name: 'well-done', spellPower: 3, weight: 30, cost: 6500, level: 90, profession: 'SandwichArtist' }
];
exports.ToastedSandwich = ToastedSandwich;
