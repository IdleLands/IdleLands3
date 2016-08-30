
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { CONBoost } from '../effects/CONBoost';
import { LUKBoost } from '../effects/LUKBoost';

export class LightFromTheStars extends Spell {
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'Light From The Stars',   spellPower: 15, weight: 25, cost: 200,   profession: 'Bard', level: 1 },
    { name: 'Purity From The Stars',  spellPower: 30, weight: 25, cost: 2000,  profession: 'Bard', level: 50 }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'CONBoost') && this.$canTarget.allyWithoutEffect(caster, 'LUKBoost');
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
        applyEffect: CONBoost,
        applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.con * this.spellPower/100)),
        applyEffectName: `${this.tier.name} (CON)`,
        targets: [target]
      });

      super.cast({
        damage: 0,
        message: '',
        applyEffect: LUKBoost,
        applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.luk * this.spellPower/100)),
        applyEffectName: `${this.tier.name} (LUK)`,
        targets: [target]
      });

    });
  }
}