
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { ATTACK_STATS } from '../../../shared/stat-calculator';

export class Shattershot extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'shattershot',   spellPower: 2, weight: 30, cost: 25,  level: 25,  profession: 'Archer' },
    { name: 'shatterblast',  spellPower: 3, weight: 30, cost: 35,  level: 65,  profession: 'Archer' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyWithoutEffect(caster, 'Shatter');
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.75;
    const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 1.50;
    return this.minMax(min, max) * (this.spellPower-1);
  }

  calcDuration() {
    return 2;
  }

  calcPotency() {
    return 1;
  }

  cast() {
    const message = '%player knocked %targetName to the floor using a %spellName, dealing %damage damage!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      super.cast({
        damage,
        message,
        targets: [target]
      });

      _.each(_.sampleSize(ATTACK_STATS, this.spellPower), stat => {
        const properEffect = _.capitalize(stat);
        const effect = require(`../effects/${properEffect}`)[properEffect];

        super.cast({
          damage: 0,
          message: '',
          applyEffect: effect,
          applyEffectName: stat,
          targets: [target]
        });
      });
    });
  }
}