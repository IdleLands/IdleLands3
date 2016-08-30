
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { DamageReductionBoost } from '../effects/DamageReductionBoost';

export class EnergyShield extends Spell {
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'energy shield',      spellPower: 100,    weight: 25, cost: 200,  profession: 'Mage', level: 5 },
    { name: 'energy buckler',     spellPower: 400,    weight: 25, cost: 900,  profession: 'Mage', level: 25 },
    { name: 'energy towershield', spellPower: 1000,   weight: 25, cost: 2200, profession: 'Mage', level: 65 },
    { name: 'energy omegashield', spellPower: 5000,   weight: 25, cost: 6000, profession: 'Mage', level: 125 },

    { name: 'energy barrier',      spellPower: 100,   weight: 25, cost: 400,  profession: 'Generalist', level: 15 },
    { name: 'energy barricade',    spellPower: 300,   weight: 25, cost: 1300, profession: 'Generalist', level: 45 },
    { name: 'energy wall',         spellPower: 900,   weight: 25, cost: 3000, profession: 'Generalist', level: 95 },
    { name: 'energy greatwall',    spellPower: 4000,  weight: 25, cost: 9000, profession: 'Generalist', level: 165 }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'DamageReductionBoost');
  }

  determineTargets() {
    return this.$targetting.randomAllyWithoutEffect('DamageReductionBoost');
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
        applyEffect: DamageReductionBoost,
        targets: [target]
      });
    });
  }
}