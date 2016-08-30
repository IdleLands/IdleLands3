
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { AllStatsDown } from '../effects/AllStatsDown';

export class Siphon extends Spell {
  static element = SpellType.DEBUFF;
  static tiers = [
    { name: 'siphon',      spellPower: 1, weight: 30, cost: 100,   level: 1,   profession: 'Necromancer' },
    { name: 'drain',       spellPower: 2, weight: 30, cost: 500,   level: 15,  profession: 'Necromancer' },
    { name: 'deteriorate', spellPower: 3, weight: 30, cost: 3000,  level: 35,  profession: 'Necromancer' },
    { name: 'wither',      spellPower: 4, weight: 30, cost: 7500,  level: 75,  profession: 'Necromancer' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyWithoutEffect(caster, 'AllStatsDown') ;
  }

  determineTargets() {
    return this.$targetting.randomEnemyWithoutEffect('AllStatsDown');
  }

  calcDamage() {
    const min = this.caster.liveStats.int / 8;
    const max = this.caster.liveStats.int / 4;
    return this.minMax(min, max);
  }

  calcDuration() {
    return 2 + this.spellPower;
  }

  calcPotency() {
    return 5 * this.spellPower;
  }

  preCast() {
    const targets = this.determineTargets();
    const message = '%player used %spellName on %targetName and siphoned %damage hp!';

    _.each(targets, target => {
      const damage = this.calcDamage();

      this.caster._hp.add(damage);

      super.cast({
        damage,
        message,
        applyEffect: AllStatsDown,
        targets: [target]
      });
    });
  }
}