
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { ATTACK_STATS } from '../../../shared/stat-calculator';

export class SavageStab extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'savage stab',  spellPower: 1, weight: 30, cost: 30,  level: 45,  profession: 'Rogue' }
  ];

  static shouldCast(caster) {
    return _.includes(['wombo combo', 'heartbleed'], caster.$lastComboSkill);
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.05;
    const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.075;
    return this.minMax(min, max) * this.spellPower;
  }

  calcDuration() {
    return 2;
  }

  calcPotency() {
    return 1;
  }

  cast() {
    this.caster.$profession.updateSkillCombo(this.caster, this.tier.name);
    const message = '%player used %spellName on %targetName and dealt %damage damage!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      super.cast({
        damage,
        message,
        targets: [target]
      });

      _.each(ATTACK_STATS, stat => {
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