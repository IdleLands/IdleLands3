
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { DEXLoss } from '../effects/DEXLoss';

export class SmokeBomb extends Spell {
  static element = SpellType.DEBUFF;
  static tiers = [
    { name: 'smoke bomb',       spellPower: 1,  weight: 25, cost: 100,   profession: 'Archer', level: 5 },
    { name: 'smoke grenade',    spellPower: 2,  weight: 25, cost: 500,   profession: 'Archer', level: 35 },
    { name: 'smoke missile',    spellPower: 3,  weight: 25, cost: 1500,  profession: 'Archer', level: 85 }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyWithoutEffect(caster, 'DEXLoss');
  }

  determineTargets() {
    return this.$targetting.allEnemies;
  }

  calcDuration() {
    return 2 + this.spellPower;
  }

  calcPotency() {
    return 25 * this.spellPower;
  }

  preCast() {
    const message = '%player throws a %spellName at %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        applyEffect: DEXLoss,
        targets: [target]
      });
    });
  }
}