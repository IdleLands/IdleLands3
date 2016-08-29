
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { ZeroDay as ZeroDayEffect } from '../effects/ZeroDay';

export class ZeroDay extends Spell {
  static element = SpellType.DIGITAL;
  static stat = 'special';
  static tiers = [
    { name: 'zero-day threat',  spellPower: 1,  weight: 40, cost: 64,     level: 32,    profession: 'Bitomancer' },
    { name: 'zero-day attack',  spellPower: 5,  weight: 40, cost: 128,    level: 64,    profession: 'Bitomancer' },
    { name: 'zero-day assault', spellPower: 10, weight: 40, cost: 512,    level: 128,   profession: 'Bitomancer' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyNotProfession(caster, 'Bitomancer') && this.$canTarget.enemyWithoutEffect(caster, 'ZeroDay');
  }

  determineTargets() {
    return this.$targetting.randomEnemyNotProfession('Bitomancer');
  }

  calcDuration() {
    return 2 + this.spellPower;
  }

  calcPotency() {
    return this.spellPower * 100;
  }

  cast() {
    const message = '%player executed a %spellName on %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        applyEffect: ZeroDayEffect,
        targets: [target]
      });
    });
  }
}