
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { STRBoost } from '../effects/STRBoost';

export class ClericStrength extends Spell {
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'boar strength',    spellPower: 15,  weight: 25, cost: 200,   profession: 'Cleric', level: 15 },
    { name: 'demon strength',   spellPower: 30,  weight: 25, cost: 400,   profession: 'Cleric', level: 30 },
    { name: 'dragon strength',  spellPower: 60,  weight: 25, cost: 700,   profession: 'Cleric', level: 60 },
    { name: 'titan strength',   spellPower: 120, weight: 25, cost: 1100,  profession: 'Cleric', level: 95 }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'STRBoost');
  }

  determineTargets() {
    return this.$targetting.randomAllyWithoutEffect('STRBoost');
  }

  calcDuration() {
    return 5;
  }

  calcPotency() {
    return this.spellPower;
  }

  cast() {
    const message = '%player cast %spellName on %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        applyEffect: STRBoost,
        targets: [target]
      });
    });
  }
}