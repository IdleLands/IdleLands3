
import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class MultiFire extends Spell {
  static description = 'A spell that hits multiple times.';
  static element = SpellType.FIRE;
  static tiers = [
    { name: 'double fire',    spellPower: 2,  weight: 40, cost: 250,  level: 25,  profession: 'Mage' },
    { name: 'triple fire',    spellPower: 3,  weight: 40, cost: 750,  level: 55,  profession: 'Mage' },
    { name: 'quadruple fire', spellPower: 4, weight: 40, cost: 1250, level: 85,  profession: 'Mage' },
    { name: 'fire star',      spellPower: 5, weight: 40, cost: 1700, level: 185, profession: 'Mage',
      collectibles: ['Bucket of Lava'] }
  ];

  static shouldCast() {
    return this.$canTarget.yes();
  }

  calcDamage() {
    const min = this.caster.liveStats.int * 0.5;
    const max = this.caster.liveStats.int * 0.8;
    return this.minMax(min, max);
  }

  determineTargets() {
    return this.$targetting.randomEnemies(this.spellPower);
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