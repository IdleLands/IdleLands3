
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class FinishingBlow extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'finishing blow',  spellPower: 1, weight: 30, cost: 30,  level: 38,  profession: 'Rogue' },
    { name: 'finishing blow',  spellPower: 2, weight: 30, cost: 30,  level: 98,  profession: 'Rogue' }
  ];

  static shouldCast(caster) {
    return _.includes(['wombo combo', 'savage stab', 'heartbleed'], caster.$lastComboSkill);
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 1.45;
    const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 2.25;
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