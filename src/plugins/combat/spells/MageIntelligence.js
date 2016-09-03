
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { INTBoost } from '../effects/INTBoost';

export class MageIntelligence extends Spell {
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'magic intelligence',    spellPower: 15,  weight: 25, cost: 200,   profession: 'Mage', level: 15 },
    { name: 'magic brilliance',      spellPower: 30,  weight: 25, cost: 400,   profession: 'Mage', level: 30 },
    { name: 'arcane intelligence',   spellPower: 60,  weight: 25, cost: 700,   profession: 'Mage', level: 60 },
    { name: 'arcane brilliance',     spellPower: 120, weight: 25, cost: 1100,  profession: 'Mage', level: 95 }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'INTBoost');
  }

  determineTargets() {
    return this.$targetting.randomAllyWithoutEffect('INTBoost');
  }

  calcDuration() {
    return 5;
  }

  calcPotency() {
    return this.spellPower;
  }

  preCast() {
    const message = '%player cast %spellName on %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        applyEffect: INTBoost,
        targets: [target]
      });
    });
  }
}