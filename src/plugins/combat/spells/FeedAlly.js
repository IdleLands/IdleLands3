
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { SandwichGenerator } from '../../../shared/sandwich-generator';

import { Sandwich } from '../effects/Sandwich';
import { Cookie } from '../effects/Cookie';

export class FeedAlly extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'feed ally',   spellPower: 1, weight: 30, cost: 50,    level: 20,    profession: 'SandwichArtist' },
    { name: 'stuff ally',  spellPower: 2, weight: 30, cost: 500,   level: 50,    profession: 'SandwichArtist' }
  ];

  static shouldCast() {
    return this.$canTarget.yes();
  }

  determineTargets() {
    return this.$targetting.randomAlly;
  }

  calcDamage() {
    const min = this.caster.liveStats.dex / 5;
    const max = this.caster.liveStats.dex;
    return -this.minMax(min, max) * this.spellPower;
  }

  calcPotency() {
    return 10;
  }

  calcDuration() {
    return this.spellPower + 3;
  }

  preCast() {
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      const sandwich = SandwichGenerator.generateSandwich(target);

      const message = '%player served %targetName a %item, healing %healed hp!';

      super.cast({
        damage,
        message,
        messageData: { item: sandwich.name },
        applyEffect: Sandwich,
        applyEffectExtra: sandwich,
        applyEffectName: sandwich.name,
        targets: [target]
      });

      if(target === this.caster) return;

      const sandwichRating = Spell.chance.integer({ min: 1, max: 7 });
      if(sandwichRating < 5) {
        super.cast({
          damage: 0,
          message: '%targetName rated the sandwich poorly, and %player eats the cookie instead!',
          targets: [target]
        });
        super.cast({
          damage: 0,
          applyEffect: Cookie,
          applyEffectName: 'cookie',
          targets: [this.caster]
        });
      } else {
        super.cast({
          damage: 0,
          message: '%targetName rated the sandwich at at least a 5/7, and gets a free cookie!',
          applyEffect: Cookie,
          applyEffectName: 'cookie',
          targets: [target]
        });
      }
    });
  }
}