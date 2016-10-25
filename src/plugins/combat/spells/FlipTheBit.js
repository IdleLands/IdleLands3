
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class FlipTheBit extends Spell {
  static element = SpellType.DIGITAL;
  static stat = 'special';
  static tiers = [
    { name: 'flip the bit', spellPower: 1, weight: 40, cost: 512, level: 1, profession: 'Bitomancer' }
  ];

  static shouldCast(caster) {
    return this.$canTarget.anyBitFlippable(caster);
  }

  determineTargets() {
    return this.$targetting.randomBitFlippable;
  }

  preCast() {
    const message = '%player executed %spellName on %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {

      const hp = target.hp;
      const mp = target.mp || 1;

      target._hp.set(mp);
      target._mp.set(hp);

      super.cast({
        damage: 0,
        message,
        targets: [target]
      });
    });
  }
}