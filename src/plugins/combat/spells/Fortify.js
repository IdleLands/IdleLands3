
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { PhysicalStatBoost } from '../effects/PhysicalStatBoost';

export class Fortify extends Spell {
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'fortify',          spellPower: 10, weight: 25, cost: 200,  profession: 'Generalist', level: 15 },
    { name: 'greater fortify',  spellPower: 15, weight: 25, cost: 900,  profession: 'Generalist', level: 45 },
    { name: 'ultimate fortify', spellPower: 20, weight: 25, cost: 2200, profession: 'Generalist', level: 90 }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'PhysicalStatBoost');
  }

  determineTargets() {
    return this.$targetting.allAllies;
  }

  calcDuration() {
    return Math.floor(this.spellPower / 2);
  }

  calcPotency() {
    return this.spellPower;
  }

  preCast() {
    const message = '%player cast %spellName on %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        applyEffect: PhysicalStatBoost,
        targets: [target]
      });
    });
  }
}