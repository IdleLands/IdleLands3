"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class Revive extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.anyAllyDead(caster);
    }
    determineTargets() {
        return this.$targetting.randomDeadAlly;
    }
    preCast() {
        const message = '%player cast %spellName at %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            const damage = -Math.round(target._hp.maximum * this.spellPower / 100);
            super.cast({
                damage,
                message,
                targets: [target]
            });
        });
    }
}
Revive.description = 'A spell that revives a dead ally.';
Revive.element = spell_1.SpellType.HEAL;
Revive.tiers = [
    { name: 'revive', spellPower: 25, weight: 100, cost: 500, level: 25, profession: 'Cleric' },
    { name: 'resurrect', spellPower: 50, weight: 100, cost: 1500, level: 65, profession: 'Cleric' }
];
exports.Revive = Revive;
