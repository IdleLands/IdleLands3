
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { SandwichGenerator } from '../../../shared/sandwich-generator';

import { Sandwich } from '../effects/Sandwich';
import { Cookie } from '../effects/Cookie';

export class FoodFight extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'food fight',  spellPower: 1, weight: 30, cost: 500,    level: 20,    profession: 'SandwichArtist' },
    { name: 'food melee',  spellPower: 2, weight: 30, cost: 1500,   level: 50,    profession: 'SandwichArtist' },
    { name: 'food brawl',  spellPower: 3, weight: 30, cost: 3500,   level: 75,    profession: 'SandwichArtist' }
  ];

  static shouldCast() {
    return this.$canTarget.yes();
  }

  determineTargets() {
    return this.$targetting.allAlive;
  }

  calcDamage() {
    const min = this.caster.liveStats.dex / 8;
    const max = this.caster.liveStats.dex / 4;
    return this.minMax(min, max) * this.spellPower;
  }

  calcPotency() {
    return this.spellPower;
  }

  calcDuration() {
    return Spell.chance.integer({ min: 2, max: 5 }) + this.spellPower;
  }

  preCast() {
    const targets = this.determineTargets();

    _.each(targets, target => {
      let damage = 0;
      let message = '%player started a %spellName!';

      if(Spell.chance.bool({ likelihood: 90 })) {
        const sandwich = SandwichGenerator.generateSandwich(target);
        if(Spell.chance.bool({ likelihood: 75 })) {
          damage = this.calcDamage();
          message = `${message} %targetName got hit with %item and took %damage damage!`;
        } else {
          message = `${message} %targetName barely avoided getting hit with %item, but ate it anyway.`;
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

      } else {
        message = `${message} %targetName caught a cookie!`;

        super.cast({
          damage,
          message,
          applyEffect: Cookie,
          applyEffectName: 'cookie',
          targets: [this.caster]
        });
      }

    });
  }
}