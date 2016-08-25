
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { Thunderstrike as ThunderstrikeEffect } from '../effects/Thunderstrike';

export class Thunderstrike extends Spell {
  static element = SpellType.THUNDER;
  static tiers = [
    { name: 'thunderstrike',  spellPower: 1, weight: 40, cost: 500,   level: 35,  profession: 'Mage' },
    { name: 'thunderstorm',   spellPower: 2, weight: 40, cost: 1500,  level: 85,  profession: 'Mage' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyWithoutEffect(caster, 'Thunderstrike');
  }

  determineTargets() {
    return this.$targetting.randomEnemyWithoutEffect('Thunderstrike');
  }

  calcDuration() {
    return Spell.chance.integer({ min: 1, max: 3 }) + this.spellPower;
  }

  calcPotency() {
    const min = this.caster.liveStats.int / 16;
    const max = this.caster.liveStats.int / 4;
    return this.minMax(min, max) * this.spellPower;
  }

  cast() {
    const message = '%player cast %spellName at %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {

      super.cast({
        damage: 0,
        message,
        applyEffect: ThunderstrikeEffect,
        targets: [target]
      });
    });
  }
}