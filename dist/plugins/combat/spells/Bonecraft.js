"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class Bonecraft extends spell_1.Spell {
    static shouldCast(caster) {
        return false; // this.$canTarget.anyBonecraftable(caster);
    }
    determineTargets() {
        return this.$targetting.randomBonecraftable;
    }
    preCast() {
        const message = '%player cast %spellName at %targetName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            const damage = -Math.round(target._hp.maximum * this.spellPower / 100);
            if (!target.$prevParty) {
                target.$prevParty = target.party;
            }
            target.party.playerLeave(target);
            this.caster.party.playerJoin(target);
            super.cast({
                damage,
                message,
                targets: [target]
            });
        });
    }
}
Bonecraft.description = 'A spell that reanimates a dead target to fight for the caster\'s party.';
Bonecraft.element = spell_1.SpellType.HEAL;
Bonecraft.tiers = [
    { name: 'bonecraft', spellPower: 25, weight: 100, cost: 25000, level: 80, profession: 'Necromancer',
        collectibles: ['Necronomicon'] }
];
exports.Bonecraft = Bonecraft;
