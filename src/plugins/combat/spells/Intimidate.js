import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { Intimidate as IntimidateEffect } from '../effects/Intimidate';

export class Intimidate extends Spell {
  static description = 'A spell that costs rage to make an enemy vulnerable to crits.';
  static element = SpellType.DEBUFF;
  static tiers = [
    { name: 'intimidate',  spellPower: 1, weight: 15, cost: 0,  level: 1,  profession: 'Barbarian' },
    { name: 'terrorize',  spellPower: 4, weight: 15, cost: 0,  level: 50,  profession: 'Barbarian' }
  ];

  static shouldCast(caster) {
    return caster._special.gtePercent(25) && return this.$canTarget.enemyWithoutEffect(caster, 'Intimidate');
  }
  
  determineTargets() {
    return this.$targetting.randomEnemyWithoutEffect('Intimidate');
  }

  calcPotency() {
    return this.spellPower*100;
  }

  calcDuration() {
    return 3 + this.spellPower;
  }

  preCast() {
    const message = '%player starts to %spellName %targetName!';
    const targets = this.determineTargets();
    
    this.caster._special.sub(25);

    _.each(targets, target => {

      super.cast({
        damage,
        message,
        applyEffect: IntimidateEffect,
        targets: [target]
      });
    });
  }
}
