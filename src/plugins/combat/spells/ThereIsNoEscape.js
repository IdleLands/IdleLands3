
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { DEXBoost } from '../effects/DEXBoost';
import { AGIBoost } from '../effects/AGIBoost';

export class ThereIsNoEscape extends Spell {
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'There Is No Escape', spellPower: 15, weight: 25, cost: 200,   profession: 'Bard', level: 1 },
    { name: 'You Shant Get Away', spellPower: 30, weight: 25, cost: 2000,  profession: 'Bard', level: 50 }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'DEXBoost') && this.$canTarget.allyWithoutEffect(caster, 'AGIBoost');
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
    const message = '%player begins singing %spellName at %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {

      super.cast({
        damage: 0,
        message,
        applyEffect: DEXBoost,
        applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.dex * this.spellPower/100)),
        applyEffectName: `${this.tier.name} (DEX)`,
        targets: [target]
      });

      super.cast({
        damage: 0,
        message: '',
        applyEffect: AGIBoost,
        applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.agi * this.spellPower/100)),
        applyEffectName: `${this.tier.name} (AGI)`,
        targets: [target]
      });

    });
  }
}