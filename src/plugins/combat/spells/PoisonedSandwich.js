
import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { SandwichGenerator } from '../../../shared/sandwich-generator';

import { PoisonedSandwich as PoisonedSandwichEffect } from '../effects/PoisonedSandwich';

export class PoisonedSandwich extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'poisoned',   spellPower: 3, weight: 30, cost: 85,   level: 15,    profession: 'SandwichArtist' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyWithoutEffect(caster, 'PoisonedSandwich');
  }

  determineTargets() {
    return this.$targetting.randomEnemyWithoutEffect('PoisonedSandwich');
  }

  calcPotency() {
    const min = (this.caster.liveStats.dex + this.caster.liveStats.int) / 8;
    const max = (this.caster.liveStats.dex + this.caster.liveStats.int) / 4;
    return this.minMax(min, max) * this.spellPower;
  }

  calcDuration() {
    return this.spellPower;
  }

  preCast() {
    const targets = this.determineTargets();

    _.each(targets, target => {

      const sandwich = SandwichGenerator.generateSandwich(target);
      sandwich.name = `${this.tier.name} ${sandwich.name}`;
      sandwich.con -= this.spellPower * this.caster.level;

      const message = '%player served %targetName a %item, sickening %targetName!';

      const casterCon = this.caster.liveStats.con;
      const targetCon = target.liveStats.con;
      let durationBoost = 0;

      if(targetCon < casterCon)   durationBoost++;
      if(targetCon < casterCon/2) durationBoost++;
      if(targetCon < casterCon/4) durationBoost++;

      super.cast({
        damage: 0,
        message,
        messageData: { item: sandwich.name },
        applyEffect: PoisonedSandwichEffect,
        applyEffectExtra: sandwich,
        applyEffectName: sandwich.name,
        applyEffectDuration: this.calcDuration() + durationBoost,
        targets: [target]
      });
    });
  }
}