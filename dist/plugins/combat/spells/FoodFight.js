"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const sandwich_generator_1 = require("../../../shared/sandwich-generator");
const Sandwich_1 = require("../effects/Sandwich");
const Cookie_1 = require("../effects/Cookie");
class FoodFight extends spell_1.Spell {
    static shouldCast() {
        return this.$canTarget.yes();
    }
    determineTargets() {
        return this.$targetting.allAlive;
    }
    calcDamage() {
        const min = this.caster.liveStats.dex / 8;
        const max = this.caster.liveStats.dex / 4;
        return this.minMax(min, max) * this.spellPower;
    }
    calcPotency() {
        return this.spellPower;
    }
    calcDuration() {
        return spell_1.Spell.chance.integer({ min: 2, max: 5 }) + this.spellPower;
    }
    preCast() {
        const targets = this.determineTargets();
        _.each(targets, target => {
            let damage = 0;
            let message = '%player started a %spellName!';
            if (spell_1.Spell.chance.bool({ likelihood: 90 })) {
                const sandwich = sandwich_generator_1.SandwichGenerator.generateSandwich(target);
                if (spell_1.Spell.chance.bool({ likelihood: 75 })) {
                    damage = this.calcDamage();
                    message = `${message} %targetName got hit with %item and took %damage damage!`;
                }
                else {
                    message = `${message} %targetName barely avoided getting hit with %item, but ate it anyway.`;
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
            }
            else {
                message = `${message} %targetName caught a cookie!`;
                super.cast({
                    damage,
                    message,
                    applyEffect: Cookie_1.Cookie,
                    applyEffectName: 'cookie',
                    targets: [this.caster]
                });
            }
        });
    }
}
FoodFight.element = spell_1.SpellType.PHYSICAL;
FoodFight.tiers = [
    { name: 'food fight', spellPower: 1, weight: 30, cost: 500, level: 20, profession: 'SandwichArtist' },
    { name: 'food melee', spellPower: 2, weight: 30, cost: 1500, level: 50, profession: 'SandwichArtist' },
    { name: 'food brawl', spellPower: 3, weight: 30, cost: 3500, level: 75, profession: 'SandwichArtist' }
];
exports.FoodFight = FoodFight;
