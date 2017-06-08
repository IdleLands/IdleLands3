
import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class HolyBolt extends Spell {
  static description = 'A spell that uses INT to deal damage.';
  static element = SpellType.HOLY;
  static tiers = [
    { name: 'holy bolt',      spellPower: 3, weight: 40, cost: 10,   level: 1,  profession: 'Cleric' },
    { name: 'divine bolt',    spellPower: 5, weight: 40, cost: 300,  level: 25, profession: 'Cleric' },
    { name: 'celestial bolt', spellPower: 7, weight: 40, cost: 1800, level: 55, profession: 'Cleric' }
  ];

  static shouldCast() {
    return this.$canTarget.yes();
  }

  calcDamage() {
    const min = this.caster.liveStats.int / 4;
    const max = this.caster.liveStats.int / 2;
    return this.minMax(min, max) * this.spellPower;
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  preCast() {
    const message = '%player cast %spellName at %targetName and dealt %damage damage!';
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