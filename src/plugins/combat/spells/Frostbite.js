
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { Frostbite as FrostbiteEffect } from '../effects/Frostbite';

export class Frostbite extends Spell {
  static element = SpellType.ICE;
  static tiers = [
    { name: 'frostbite',  spellPower: 1, weight: 40, cost: 300,  level: 15,  profession: 'Mage' },
    { name: 'cold snap',  spellPower: 2, weight: 40, cost: 900,  level: 65,  profession: 'Mage' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyWithoutEffect(caster, 'Frostbite');
  }

  determineTargets() {
    return this.$targetting.randomEnemyWithoutEffect('Frostbite');
  }

  calcDamage() {
    const min = this.caster.liveStats.int / 8;
    const max = this.caster.liveStats.int / 6;
    return this.minMax(min, max) * this.spellPower;
  }

  calcPotency() {
    return this.spellPower*25;
  }

  calcDuration() {
    return 2 + this.spellPower;
  }

  cast() {
    const message = '%player cast %spellName at %targetName and dealt %damage damage!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      super.cast({
        damage,
        message,
        applyEffect: FrostbiteEffect,
        targets: [target]
      });
    });
  }
}
