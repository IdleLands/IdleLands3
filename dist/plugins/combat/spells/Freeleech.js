"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
class Freeleech extends spell_1.Spell {
    static shouldCast(caster) {
        return caster._special.ltePercent(30);
    }
    determineTargets() {
        return this.$targetting.allAlive;
    }
    calcDamage() {
        const min = this.caster.liveStats.dex / 4;
        const max = this.caster.liveStats.dex / 2;
        return this.minMax(min, max) * this.spellPower;
    }
    preCast() {
        const targets = this.determineTargets();
        const message = '%player started a %spellName, stealing %bandwidth bandwidth from %targetName!';
        _.each(targets, target => {
            if (target === this.caster)
                return;
            const isTargetBito = target.professionName === 'Bitomancer';
            const bandwidthStolen = isTargetBito ? Math.round(target.special / 10) : Math.round(this.caster._special.maximum / 15);
            if (isTargetBito) {
                target._special.sub(bandwidthStolen);
            }
            this.caster._special.add(bandwidthStolen);
            super.cast({
                damage: 0,
                message,
                messageData: { bandwidth: bandwidthStolen },
                targets: [target]
            });
        });
    }
}
Freeleech.description = 'A spell that steals Bandwidth from all enemies.';
Freeleech.element = spell_1.SpellType.DIGITAL;
Freeleech.stat = 'special';
Freeleech.tiers = [
    { name: 'freeleech', spellPower: 1, weight: 10, cost: 0, level: 1, profession: 'Bitomancer' }
];
exports.Freeleech = Freeleech;
