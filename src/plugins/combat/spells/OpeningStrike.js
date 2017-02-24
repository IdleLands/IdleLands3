
import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class OpeningStrike extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'opening strike',  spellPower: 1, weight: 30, cost: 10,  level: 1,   profession: 'Rogue' },
    { name: 'opening strike',  spellPower: 2, weight: 30, cost: 10,  level: 61,  profession: 'Rogue' }
  ];

  static shouldCast(caster) {
    return caster.$lastComboSkillTurn <= 0;
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.25;
    const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.5;
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