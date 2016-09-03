
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { PercentageHPHeal } from '../effects/PercentageHPHeal';

export class PaleMoonlight extends Spell {
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'Through the Pale Moonlight',        spellPower: 3,   weight: 25, cost: 200,   profession: 'Bard', level: 1 },
    { name: 'Shining Bright Against the Night',  spellPower: 7.5, weight: 25, cost: 2000,  profession: 'Bard', level: 50 }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'PercentageHPHeal');
  }

  determineTargets() {
    return this.$targetting.allAllies;
  }

  calcDuration() {
    return 5;
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
        applyEffect: PercentageHPHeal,
        targets: [target]
      });

    });
  }
}