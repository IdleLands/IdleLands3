"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const spell_1 = require("../spell");
const STRBoost_1 = require("../effects/STRBoost");
const DrunkenStupor_1 = require("../effects/DrunkenStupor");
class PirateShanty extends spell_1.Spell {
    static shouldCast(caster) {
        return this.$canTarget.allyWithoutEffect(caster, 'STRBoost') && !caster.$effects.hasEffect('DrunkenStupor');
    }
    determineTargets() {
        return this.$targetting.allAllies;
    }
    calcDuration() {
        return 6 - (3 - Math.floor(this.caster.special / 33));
    }
    calcPotency() {
        return 20 + 3 * Math.floor(11 - this.caster.special / 9);
    }
    preCast() {
        const targets = this.determineTargets();
        _.each(targets, target => {
            let message = '%player sings a %spellName with %targetName!';
            if (target.professionName === 'Pirate') {
                target.$drunk.add(spell_1.Spell.chance.integer({ min: 25, max: 45 }) + target.$personalities && target.$personalities.isActive('Drunk') ? 15 : 0);
                if (target.$drunk.atMaximum()) {
                    message = `${message} %targetName is absolutely hammered!`;
                    super.cast({
                        damage: 0,
                        message: '',
                        applyEffect: DrunkenStupor_1.DrunkenStupor,
                        applyEffectName: 'drunken stupor',
                        applyEffectDuration: 4,
                        applyEffectPotency: 1,
                        targets: [target]
                    });
                }
            }
            super.cast({
                damage: 0,
                message,
                applyEffect: STRBoost_1.STRBoost,
                targets: [target]
            });
        });
    }
}
PirateShanty.description = 'Sings an inspirational sea shanty with an ally, increasing STR and drunkenness. STR boost scales on # of Bottles. The "DrunkenStupor" effect is gained when drunknness reaches 100%.';
PirateShanty.element = spell_1.SpellType.BUFF;
PirateShanty.stat = 'special';
PirateShanty.tiers = [
    { name: 'pirate shanty', spellPower: 1, weight: 25, cost: 18, profession: 'Pirate', level: 25 }
];
exports.PirateShanty = PirateShanty;
