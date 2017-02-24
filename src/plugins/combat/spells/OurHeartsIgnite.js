
import * as _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { STRBoostValue } from '../effects/STRBoostValue';
import { INTBoostValue } from '../effects/INTBoostValue';

export class OurHeartsIgnite extends Spell {
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'Our Hearts Ignite', spellPower: 15, weight: 25, cost: 200,   profession: 'Bard', level: 1 },
    { name: 'Our Hearts Blaze',  spellPower: 30, weight: 25, cost: 2000,  profession: 'Bard', level: 50 }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'STRBoostValue') && this.$canTarget.allyWithoutEffect(caster, 'INTBoostValue');
  }

  determineTargets() {
    return this.$targetting.allAllies;
  }

  calcDuration() {
    return 3;
  }

  calcPotency() {
    return this.spellPower;
  }

  preCast() {
    const message = '%player begins singing %spellName at %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {

      super.cast({
        damage: 0,
        message,
        applyEffect: STRBoostValue,
        applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.str * this.spellPower/100)),
        applyEffectName: `${this.tier.name} (STR)`,
        targets: [target]
      });

      super.cast({
        damage: 0,
        message: '',
        applyEffect: INTBoostValue,
        applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.int * this.spellPower/100)),
        applyEffectName: `${this.tier.name} (INT)`,
        targets: [target]
      });

    });
  }
}