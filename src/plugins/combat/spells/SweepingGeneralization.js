
import { Spell, SpellType } from '../../../core/base/spell';

export class SweepingGeneralization extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'sweeping generalization', spellPower: 1.7, weight: 1, cost: 350, profession: 'Generalist', level: 5 },
    { name: 'sweepo generalizo',       spellPower: 1.2, weight: 1, cost: 600, profession: 'MagicalMonster', level: 15,
      collectibles: ['Generalist\'s Guidebook'] }
  ];

  calcDamage() {
    const min = (this.caster.stats.str + this.caster.stats.dex) / 4;
    const max = (this.caster.stats.str + this.caster.stats.dex) / 2;
    return this.minMax(min, max);
  }

  determineTargets() {

  }

  cast() {

  }
}