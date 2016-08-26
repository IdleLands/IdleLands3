
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { SandwichGenerator } from '../../../shared/sandwich-generator';

import { Sandwich } from '../effects/Sandwich';

export class ToastedSandwich extends Spell {
  static element = SpellType.FIRE;
  static tiers = [
    { name: 'toasted',   spellPower: 1, weight: 30, cost: 125,   level: 10,   profession: 'SandwichArtist' },
    { name: 'burnt',     spellPower: 2, weight: 30, cost: 1300,  level: 40,   profession: 'SandwichArtist' },
    { name: 'well-done', spellPower: 3, weight: 30, cost: 6500,  level: 90,   profession: 'SandwichArtist' }
  ];

  static shouldCast() {
    return this.$canTarget.yes();
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = (this.caster.liveStats.dex + this.caster.liveStats.int) / 8;
    const max = (this.caster.liveStats.dex + this.caster.liveStats.int) / 4;
    return this.minMax(min, max) * this.spellPower;
  }

  calcPotency() {
    return 1;
  }

  calcDuration() {
    return 2 + this.spellPower;
  }

  cast() {
    const targets = this.determineTargets();

    _.each(targets, target => {
      let damage = 0;

      const sandwich = SandwichGenerator.generateSandwich(target);

      let message = '%player served %targetName a %item.';

      if(Spell.chance.bool({ likelihood: 75 })) {
        sandwich.name = `${this.tier.name} ${sandwich.name}`;
        sandwich.con -= this.spellPower * 100;
        sandwich.dex -= this.spellPower * 100;
        sandwich.agi -= this.spellPower * 100;

        damage = this.calcDamage();
        message = `${message} %targetName wanted it toasted and got burned for %damage damage!`;
      } else {
        message = `${message} %targetName didn't want it toasted.`;
      }

      super.cast({
        damage,
        message,
        messageData: { item: sandwich.name },
        applyEffect: Sandwich,
        applyEffectExtra: sandwich,
        applyEffectName: sandwich.name,
        targets: [target]
      });
    });
  }
}