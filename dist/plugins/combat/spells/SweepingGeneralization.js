"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class SweepingGeneralization extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.moreThanOneEnemy(caster);
    }
    calcDamage() {
        const min = (this.caster.stats.str + this.caster.stats.dex) / 8;
        const max = (this.caster.stats.str + this.caster.stats.dex) / 4;
        return this.minMax(min, max) * this.spellPower;
    }
    determineTargets() {
        return this.$targetting.allEnemies;
    }
    preCast() {
        const message = '%player used %spellName on %targetName and dealt %damage damage!';
        const targets = this.determineTargets();
        const damage = this.calcDamage();
        _.each(targets, target => {
            super.cast({
                damage,
                message,
                targets: [target]
            });
        });
    }
}
SweepingGeneralization.description = 'A spell that uses STR and DEX to attack all enemies.';
SweepingGeneralization.element = spell_1.SpellType.PHYSICAL;
SweepingGeneralization.tiers = [
    { name: 'sweeping generalization', spellPower: 1.0, weight: 35, cost: 50, profession: 'Generalist', level: 5 },
    { name: 'broad generalization', spellPower: 3.0, weight: 35, cost: 500, profession: 'Generalist', level: 50 },
    { name: 'sweepo generalizo', spellPower: 0.8, weight: 35, cost: 300, profession: 'MagicalMonster', level: 15,
        collectibles: ['Generalist\'s Guidebook'] }
];
exports.SweepingGeneralization = SweepingGeneralization;
