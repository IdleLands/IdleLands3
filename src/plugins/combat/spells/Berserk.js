
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

export class Berserk extends Spell {
  static description = 'A spell that increases Rage by a set amount.';
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'berserk',        spellPower: 15,  weight: 25, cost: 0,   profession: 'Barbarian', level: 1 },
    { name: 'crazy',          spellPower: 20,  weight: 25, cost: 0,   profession: 'Barbarian', level: 35 },
    { name: 'out of control', spellPower: 25,  weight: 25, cost: 0,   profession: 'Barbarian', level: 75 }
  ];

  static shouldCast(caster) {
    return caster._special.lessThanPercent(75);
  }

  determineTargets() {
    return this.$targetting.self;
  }

  preCast() {
    const message = '%player is going %spellName!';
    const targets = this.determineTargets();

    _.each(targets, target => {

      target._special.add(this.spellPower);

      super.cast({
        damage: 0,
        message,
        targets: [target]
      });
    });
  }
}
