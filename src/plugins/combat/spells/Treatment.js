
import * as _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { PercentageHPHeal } from '../effects/PercentageHPHeal';

export class Treatment extends Spell {
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'treatment',          spellPower: 5,  weight: 25, cost: 300,  profession: 'Generalist', level: 20 },
    { name: 'greater treatment',  spellPower: 10, weight: 25, cost: 1200, profession: 'Generalist', level: 60 },
    { name: 'ultimate treatment', spellPower: 15, weight: 25, cost: 2700, profession: 'Generalist', level: 120,
      collectibles: ['Doctor\'s Floating Device'] }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'PercentageHPHeal');
  }

  determineTargets() {
    return this.$targetting.randomAllyWithoutEffect('PercentageHPHeal');
  }

  calcDuration() {
    return 5;
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
        applyEffect: PercentageHPHeal,
        targets: [target]
      });
    });
  }
}