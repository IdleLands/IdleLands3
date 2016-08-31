
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class Retch extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'retch',           spellPower: 1, weight: 80, cost: 0, level: 40,  profession: 'Pirate' },
    { name: 'vomit',           spellPower: 2, weight: 80, cost: 0, level: 80,  profession: 'Pirate' },
    { name: 'explosive vomit', spellPower: 3, weight: 80, cost: 0, level: 120, profession: 'Pirate',
      collectibles: ['Unpleasant Glass of Water'] }
  ];

  static shouldCast(caster) {
    return caster.$effects.hasEffect('DrunkenStupor') || caster.$drunk.gtePercent(75);
  }

  calcDamage() {
    const drunkMultiplier = this.caster.$personalities && this.caster.$personalities.isActive('Drunk') ? 2 : 1;
    const min = this.caster.liveStats.str * 0.50 * drunkMultiplier;
    const max = this.caster.liveStats.str * 0.75 * drunkMultiplier;
    return this.minMax(min, max) * this.spellPower;
  }

  determineTargets() {
    return this.$targetting.allEnemies;
  }

  preCast() {
    const message = '%player %spellName\'d all over %targetName and dealt %damage damage!';
    const targets = this.determineTargets();
    this.caster.$drunk.toMinimum();
    this.caster._special.add(Spell.chance.integer({ min: 20, max: 30 }));

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