
import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { Heartbleed as HeartbleedEffect } from '../effects/Heartbleed';

export class Heartbleed extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'heartbleed',  spellPower: 1, weight: 30, cost: 15,  level: 15,  profession: 'Rogue' },
    { name: 'heartbleed',  spellPower: 2, weight: 30, cost: 15,  level: 75,  profession: 'Rogue' }
  ];

  static shouldCast(caster) {
    return _.includes(['chain stab'], caster.$lastComboSkill);
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.15;
    const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.45;
    return this.minMax(min, max) * this.spellPower;
  }

  calcDuration() {
    return 2;
  }

  calcPotency() {
    return 1;
  }

  preCast() {
    this.caster.$profession.updateSkillCombo(this.caster, this.tier.name);
    const message = '%player used %spellName on %targetName and dealt %damage damage!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      super.cast({
        damage,
        message,
        applyEffect: HeartbleedEffect,
        targets: [target]
      });
    });
  }
}