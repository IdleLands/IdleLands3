"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const sandwich_generator_1 = require("../../../shared/sandwich-generator");
const Stuffed_1 = require("../effects/Stuffed");
class DayOldBread extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'Stuffed');
    }
    determineTargets() {
        return this.$targetting.randomEnemyWithoutEffect('Stuffed');
    }
    calcDamage() {
        const min = this.caster.liveStats.dex / 8;
        const max = this.caster.liveStats.dex / 6;
        return this.minMax(min, max) * this.spellPower;
    }
    calcPotency() {
        return 100;
    }
    calcDuration() {
        return this.spellPower;
    }
    preCast() {
        const targets = this.determineTargets();
        _.each(targets, target => {
            const damage = this.calcDamage();
            const sandwich = sandwich_generator_1.SandwichGenerator.generateSandwich(target);
            sandwich.name = `${this.tier.name} ${sandwich.name}`;
            sandwich.con -= 50;
            const message = '%player served %targetName a %item, causing %targetName to fall over and take %damage damage!';
            super.cast({
                damage,
                message,
                messageData: { item: sandwich.name },
                applyEffect: Stuffed_1.Stuffed,
                applyEffectExtra: sandwich,
                applyEffectName: sandwich.name,
                targets: [target]
            });
        });
    }
}
DayOldBread.element = spell_1.SpellType.PHYSICAL;
DayOldBread.tiers = [
    { name: 'day-old', spellPower: 1, weight: 30, cost: 35, level: 5, profession: 'SandwichArtist' },
    { name: 'week-old', spellPower: 2, weight: 30, cost: 650, level: 50, profession: 'SandwichArtist' },
    { name: 'month-old', spellPower: 3, weight: 30, cost: 2500, level: 100, profession: 'SandwichArtist',
        collectibles: ['Funny Fungus'] },
    { name: 'second-old', spellPower: 1, weight: 30, cost: 500, level: 30, profession: 'MagicalMonster',
        collectibles: ['Funny Fungus'] }
];
exports.DayOldBread = DayOldBread;
