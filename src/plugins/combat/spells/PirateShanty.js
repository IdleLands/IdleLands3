
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { STRBoost } from '../effects/STRBoost';
import { DrunkenStupor } from '../effects/DrunkenStupor';

export class PirateShanty extends Spell {
  static description = 'Sings an inspirational sea shanty with an ally, increasing STR and drunkenness. STR boost scales on # of Bottles. The "DrunkenStupor" effect is gained when drunknness reaches 100%.';
  static element = SpellType.BUFF;
  static stat = 'special';
  static tiers = [
    { name: 'pirate shanty',    spellPower: 1,  weight: 25, cost: 18,   profession: 'Pirate', level: 25 }
  ];

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

      if(target.professionName === 'Pirate') {
        target.$drunk.add(Spell.chance.integer({ min: 25, max: 45 }) + target.$personalities && target.$personalities.isActive('Drunk') ? 15 : 0);

        if(target.$drunk.atMaximum()) {
          message = `${message} %targetName is absolutely hammered!`;

          super.cast({
            damage: 0,
            message: '',
            applyEffect: DrunkenStupor,
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
        applyEffect: STRBoost,
        targets: [target]
      });
    });
  }
}