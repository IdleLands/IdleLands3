
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { ATTACK_STATS } from '../../../shared/stat-calculator';

export class Shattershot extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'shattershot',   spellPower: 1, weight: 30, cost: 25,  level: 25,  profession: 'Archer' },
    { name: 'shatterblast',  spellPower: 2, weight: 30, cost: 35,  level: 65,  profession: 'Archer' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyWithoutEffect(caster, 'Shatter');
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = (this.caster.liveStats.str + (this.caster.liveStats.dex * 0.5)) * 0.2;
    const max = (this.caster.liveStats.str + (this.caster.liveStats.dex * 0.5)) * 0.4;
    return this.minMax(min, max) * (this.spellPower);
  }

  calcDuration() {
    return 2;
  }

  calcPotency() {
    return 1;
  }

  preCast() {
    const message = '%player knocked %targetName to the floor using a %spellName, dealing %damage damage!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      super.cast({
        damage,
        message,
        targets: [target]
      });

      super.applyCombatEffects(_.sampleSize(ATTACK_STATS, this.spellPower+1), target);
    });
  }
}