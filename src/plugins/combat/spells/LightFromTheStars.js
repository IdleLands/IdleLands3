
import * as _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { CONBoostValue } from '../effects/CONBoostValue';
import { LUKBoostValue } from '../effects/LUKBoostValue';

export class LightFromTheStars extends Spell {
  static description = 'A buff that increases CON and LUK of all allies.';
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'Light From The Stars',   spellPower: 15, weight: 25, cost: 200,   profession: 'Bard', level: 1,
      collectibles: ['Soaked Sitar'] },
    { name: 'Purity From The Stars',  spellPower: 30, weight: 25, cost: 2000,  profession: 'Bard', level: 50,
      collectibles: ['Soaked Sitar'] }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'CONBoostValue') && this.$canTarget.allyWithoutEffect(caster, 'LUKBoostValue');
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
        applyEffect: CONBoostValue,
        applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.con * this.spellPower/100)),
        applyEffectName: `${this.tier.name} (CON)`,
        targets: [target]
      });

      super.cast({
        damage: 0,
        message: '',
        applyEffect: LUKBoostValue,
        applyEffectPotency: Math.max(1, Math.round(this.caster.liveStats.luk * this.spellPower/100)),
        applyEffectName: `${this.tier.name} (LUK)`,
        targets: [target]
      });

    });
  }
}