
import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class ChainStab extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'chain stab',  spellPower: 1, weight: 20, cost: 7,  level: 8,   profession: 'Rogue' },
    { name: 'chain stab',  spellPower: 2, weight: 20, cost: 7,  level: 68,  profession: 'Rogue' }
  ];

  static shouldCast(caster) {
    return _.includes(['opening strike', 'backstab', 'chain stab'], caster.$lastComboSkill);
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.35;
    const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.45;
    return this.minMax(min, max) * this.spellPower;
  }

  preCast() {
    this.caster.$profession.updateSkillCombo(this.caster, this.tier.name);
    const message = '%player used %spellName on %targetName and dealt %damage damage!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      super.cast({
        damage,
        message,
        targets: [target]
      });
    });
  }
}