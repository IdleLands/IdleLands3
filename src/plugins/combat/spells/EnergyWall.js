
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { DamageReductionBoost } from '../effects/DamageReductionBoost';

export class EnergyWall extends Spell {
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'energy barrier',      spellPower: 100,   weight: 25, cost: 300,  profession: 'Generalist', level: 15 },
    { name: 'energy barricade',    spellPower: 300,   weight: 25, cost: 1100, profession: 'Generalist', level: 45 },
    { name: 'energy wall',         spellPower: 900,   weight: 25, cost: 2500, profession: 'Generalist', level: 95 },
    { name: 'energy greatwall',    spellPower: 4500,  weight: 25, cost: 9000, profession: 'Generalist', level: 165,
      collectibles: ['Jar of Magic Dust']  }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'DamageReductionBoost');
  }

  determineTargets() {
    return this.$targetting.allAllies;
  }

  calcDuration() {
    return 3;
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
        applyEffect: DamageReductionBoost,
        targets: [target]
      });
    });
  }
}
