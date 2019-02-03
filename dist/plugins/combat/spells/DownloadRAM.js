"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const DownloadedRAM_1 = require("../effects/DownloadedRAM");
class DownloadRAM extends spell_1.Spell {
    static shouldCast(caster) {
        return !caster.$effects.hasEffect('DownloadedRAM');
    }
    calcDuration() {
        return this.spellPower + 3;
    }
    calcPotency() {
        return this.spellPower * 10;
    }
    determineTargets() {
        return this.$targetting.self;
    }
    preCast() {
        const message = '%player downloaded some %spellName!';
        const targets = this.determineTargets();
        _.each(targets, target => {
            super.cast({
                damage: 0,
                message,
                applyEffect: DownloadedRAM_1.DownloadedRAM,
                targets: [target]
            });
        });
    }
}
DownloadRAM.description = 'A spell that increases the caster\'s STR, DEX and AGI and decreases the caster\'s INT.';
DownloadRAM.element = spell_1.SpellType.DIGITAL;
DownloadRAM.stat = 'special';
DownloadRAM.tiers = [
    { name: 'single-channel RAM', spellPower: 1, weight: 40, cost: 32, level: 8, profession: 'Bitomancer' },
    { name: 'dual-channel RAM', spellPower: 2, weight: 40, cost: 64, level: 16, profession: 'Bitomancer' },
    { name: 'triple-channel RAM', spellPower: 3, weight: 40, cost: 128, level: 32, profession: 'Bitomancer' },
    { name: 'quad-channel RAM', spellPower: 4, weight: 40, cost: 256, level: 64, profession: 'Bitomancer' }
];
exports.DownloadRAM = DownloadRAM;
