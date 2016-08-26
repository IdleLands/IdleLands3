
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class Revive extends Spell {
  static element = SpellType.HEAL;
  static tiers = [
    { name: 'revive',     spellPower: 25, weight: 100, cost: 500,  level: 25,   profession: 'Cleric' },
    { name: 'resurrect',  spellPower: 50, weight: 100, cost: 1500, level: 65,   profession: 'Cleric' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.anyAllyDead(caster);
  }

  determineTargets() {
    return this.$targetting.randomDeadAlly;
  }

  cast() {
    const message = '%player cast %spellName at %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = -Math.round(target._hp.maximum * this.spellPower/100);

      super.cast({
        damage,
        message,
        targets: [target]
      });
    });
  }
}