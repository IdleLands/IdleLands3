
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { RelentlessAssault as RelentlessAssaultEffect } from '../effects/RelentlessAssault';

export class RelentlessAssault extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'relentless assault',  spellPower: 1, weight: 30, cost: 0,  level: 50,  profession: 'Archer' }
  ];

  static shouldCast(caster) {
    return caster._special.gtePercent(70);
  }

  determineTargets() {
    return this.$targetting.self;
  }

  calcDuration() {
    return 10;
  }

  calcPotency() {
    return 1;
  }

  cast() {
    const message = '%player begins a %spellName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        applyEffect: RelentlessAssaultEffect,
        targets: [target]
      });
    });
  }
}