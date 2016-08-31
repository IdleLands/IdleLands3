
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class WomboCombo extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'wombo combo',  spellPower: 1, weight: 30, cost: 25,  level: 25,  profession: 'Rogue' }
  ];

  static shouldCast(caster) {
    return _.includes(['chain stab', 'heartbleed'], caster.$lastComboSkill);
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const min = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.5;
    const max = (this.caster.liveStats.str + this.caster.liveStats.dex) * 0.8;
    return this.minMax(min, max) * this.spellPower;
  }

  preCast() {
    this.caster.$profession.updateSkillCombo(this.caster, this.tier.name);
    const message = '%player used %spellName on %targetName and dealt %damage damage!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      for(let i = 0; i < 3; i++) {
        const damage = this.calcDamage();

        super.cast({
          damage,
          message,
          targets: [target]
        });
      }
    });
  }
}