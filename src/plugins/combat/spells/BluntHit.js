
import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { Prone as BluntHitEffect } from '../effects/Prone';

export class BluntHit extends Spell {
  static description = 'An attack that stuns the target for one turn.';
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'blunt hit',  spellPower: 1, weight: 10, cost: 300,  level: 15,  profession: 'Fighter' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyWithoutEffect(caster, 'BluntHit');
  }

  determineTargets() {
    return this.$targetting.randomEnemyWithoutEffect('BluntHit');
  }

  calcDamage() {
    const min = this.caster.liveStats.str / 6;
    const max = this.caster.liveStats.str / 4;
    return this.minMax(min, max) * this.spellPower;
  }

  calcPotency() {
    return 100;
  }

  calcDuration() {
    return 1;
  }

  preCast() {
    const message = '%player used %spellName on %targetName and dealt %damage damage!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      super.cast({
        damage,
        message,
        applyEffect: BluntHitEffect,
        targets: [target]
      });
    });
  }
}