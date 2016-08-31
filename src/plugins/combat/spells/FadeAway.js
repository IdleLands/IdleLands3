
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class FadeAway extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'fade away',         spellPower: 30, weight: 30, cost: 0,  level: 10,  profession: 'Rogue' },
    { name: 'shadowstep',        spellPower: 50, weight: 30, cost: 0,  level: 50,  profession: 'Rogue' },
    { name: 'vanish from sight', spellPower: 70, weight: 30, cost: 0,  level: 90,  profession: 'Rogue' }
  ];

  static shouldCast(caster) {
    return caster._special.ltePercent(30);
  }

  determineTargets() {
    return this.$targetting.self;
  }

  calcDamage() {
    return this.spellPower;
  }

  preCast() {
    const restoredStamina = this.calcDamage();
    const message = `%player used %spellName and recovered ${restoredStamina} stamina!`;
    const targets = this.determineTargets();

    this.caster.$profession.resetSkillCombo(this.caster);
    this.caster._special.add(restoredStamina);

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        targets: [target]
      });
    });
  }
}