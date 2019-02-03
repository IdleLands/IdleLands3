"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class CureGroup extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyBelow50PercentHealth(caster) && caster.party && caster.party.players.length > 1;
    }
    calcDamage() {
        const min = this.caster.liveStats.int;
        const max = this.caster.liveStats.int * 2;
        return -this.minMax(min, max) * this.spellPower;
    }
    determineTargets() {
        return this.$targetting.allAllies;
    }
    preCast() {
        const message = '%player cast %spellName at %targetName and healed %healed hp!';
        const targets = this.determineTargets();
        const totalHeal = this.calcDamage();
        const damage = totalHeal / this.caster.party.players.length;
        _.each(targets, target => {
            super.cast({
                damage,
                message,
                targets: [target]
            });
        });
    }
}
CureGroup.description = 'A spell that heals all allies.';
CureGroup.element = spell_1.SpellType.HEAL;
CureGroup.tiers = [
    { name: 'cure group', spellPower: 0.5, weight: 40, cost: 50, level: 30, profession: 'Cleric' },
    { name: 'heal group', spellPower: 1.0, weight: 40, cost: 5800, level: 55, profession: 'Cleric' },
    { name: 'restore group', spellPower: 1.5, weight: 40, cost: 13500, level: 95, profession: 'Cleric' },
    { name: 'revitalize group', spellPower: 2.5, weight: 40, cost: 30000, level: 145, profession: 'Cleric',
        collectibles: ['Gauntlet'] }
];
exports.CureGroup = CureGroup;
