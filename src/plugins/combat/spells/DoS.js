
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { DoS as DoSEffect } from '../effects/DoS';

export class DoS extends Spell {
  static element = SpellType.DIGITAL;
  static stat = 'special';
  static tiers = [
    { name: 'DoS',                spellPower: 1, weight: 40, cost: 64,     level: 32,    profession: 'Bitomancer' },
    { name: 'DDoS',               spellPower: 2, weight: 40, cost: 128,    level: 64,    profession: 'Bitomancer' },
    { name: 'persistent DDoS',    spellPower: 3, weight: 40, cost: 512,    level: 128,   profession: 'Bitomancer',
      collectibles: ['Gauntlet'] }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyNotProfession(caster, 'Bitomancer') && this.$canTarget.enemyWithoutEffect(caster, 'DoS');
  }

  determineTargets() {
    return this.$targetting.randomEnemyNotProfession('Bitomancer');
  }

  calcDuration() {
    return 2 + this.spellPower;
  }

  calcPotency() {
    return this.spellPower * 30;
  }

  preCast() {
    const message = '%player executed a %spellName attack on %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        applyEffect: DoSEffect,
        targets: [target]
      });
    });
  }
}