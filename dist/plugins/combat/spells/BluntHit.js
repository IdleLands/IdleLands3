"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const Prone_1 = require("../effects/Prone");
class BluntHit extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.enemyWithoutEffect(caster, 'BluntHit');
    }
    determineTargets() {
        return this.$targetting.randomEnemyWithoutEffect('BluntHit');
    }
    calcDamage() {
        const min = this.caster.liveStats.str / 6;
        const max = this.caster.liveStats.str / 4;
        return this.minMax(min, max) * this.spellPower;
    }
    calcPotency() {
        return 100;
    }
    calcDuration() {
        return 1;
    }
    preCast() {
        const message = '%player used %spellName on %targetName and dealt %damage damage!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            const damage = this.calcDamage();
            super.cast({
                damage,
                message,
                applyEffect: Prone_1.Prone,
                targets: [target]
            });
        });
    }
}
BluntHit.description = 'An attack that stuns the target for one turn.';
BluntHit.element = spell_1.SpellType.PHYSICAL;
BluntHit.tiers = [
    { name: 'blunt hit', spellPower: 1, weight: 10, cost: 300, level: 15, profession: 'Fighter' }
];
exports.BluntHit = BluntHit;
