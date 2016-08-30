
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { SandwichGenerator } from '../../../shared/sandwich-generator';

import { Stuffed } from '../effects/Stuffed';

export class DayOldBread extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'day-old',   spellPower: 1, weight: 30, cost: 35,   level: 5,    profession: 'SandwichArtist' },
    { name: 'week-old',  spellPower: 2, weight: 30, cost: 650,  level: 50,   profession: 'SandwichArtist' },
    { name: 'month-old', spellPower: 3, weight: 30, cost: 2500, level: 100,  profession: 'SandwichArtist' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyWithoutEffect(caster, 'Stuffed');
  }

  determineTargets() {
    return this.$targetting.randomEnemyWithoutEffect('Stuffed');
  }

  calcDamage() {
    const min = this.caster.liveStats.dex / 8;
    const max = this.caster.liveStats.dex / 6;
    return this.minMax(min, max) * this.spellPower;
  }

  calcPotency() {
    return 100;
  }

  calcDuration() {
    return this.spellPower;
  }

  preCast() {
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      const sandwich = SandwichGenerator.generateSandwich(target);
      sandwich.name = `${this.tier.name} ${sandwich.name}`;
      sandwich.con -= 50;

      const message = '%player served %targetName a %item, causing %targetName to fall over and take %damage damage!';

      super.cast({
        damage,
        message,
        messageData: { item: sandwich.name },
        applyEffect: Stuffed,
        applyEffectExtra: sandwich,
        applyEffectName: sandwich.name,
        targets: [target]
      });
    });
  }
}