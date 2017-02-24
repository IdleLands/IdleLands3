
import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class Cleave extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'cleave',  spellPower: 1, weight: 30, cost: 0,  level: 50,  profession: 'Barbarian' }
  ];

  static shouldCast(caster) {
    return caster._special.gtePercent(30);
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = this.caster.liveStats.str * 2;
    const max = this.caster.liveStats.str * 3;
    return this.minMax(min, max) * this.spellPower;
  }

  preCast() {
    const message = '%player used %spellName on %targetName and dealt %damage damage!';
    const targets = this.determineTargets();

    this.caster._special.toMinimum();

    _.each(targets, target => {
      const damage = this.calcDamage();

      super.cast({
        damage,
        message,
        targets: [target]
      });
    });
  }
}