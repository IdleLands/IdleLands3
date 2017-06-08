
import * as _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { DamageReductionPercentBoost } from '../effects/DamageReductionPercentBoost';

export class EnergyShield extends Spell {
  static description = 'A buff that reduces damage taken by an ally.';
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'energy shield',      spellPower: 5,   weight: 25, cost: 400,  profession: 'Mage', level: 5 },
    { name: 'energy buckler',     spellPower: 7,   weight: 25, cost: 3000,  profession: 'Mage', level: 25 },
    { name: 'energy towershield', spellPower: 10,  weight: 25, cost: 14000, profession: 'Mage', level: 65 },
    { name: 'energy omegashield', spellPower: 15,  weight: 25, cost: 80000, profession: 'Mage', level: 125,
      collectibles: ['Jar of Magic Dust'] }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'DamageReductionPercentBoost');
  }

  determineTargets() {
    return this.$targetting.randomAllyWithoutEffect('DamageReductionPercentBoost');
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
        applyEffect: DamageReductionPercentBoost,
        targets: [target]
      });
    });
  }
}