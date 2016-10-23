
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class Multishot extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'double shot',    spellPower: 2, weight: 40, cost: 20,  level: 25,  profession: 'Archer' },
    { name: 'triple shot',    spellPower: 3, weight: 40, cost: 30,  level: 55,  profession: 'Archer' },
    { name: 'quadruple shot', spellPower: 4, weight: 40, cost: 40,  level: 85,  profession: 'Archer' }
  ];

  static shouldCast() {
    return this.$canTarget.yes();
  }

  calcDamage() {
    const min = this.caster.liveStats.dex * 0.25;
    const max = this.caster.liveStats.dex * 0.50;
    return this.minMax(min, max);
  }

  determineTargets() {
    return this.$targetting.randomEnemies(this.spellPower);
  }

  preCast() {
    const message = '%player used %spellName on %targetName and dealt %damage damage!';
    const targets = this.determineTargets();

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