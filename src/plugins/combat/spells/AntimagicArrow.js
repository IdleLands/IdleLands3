
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class AntimagicArrow extends Spell {
  static element = SpellType.PHYSICAL;
  static stat = 'special';
  static tiers = [
    { name: 'anti-magic arrow', spellPower: 1, weight: 40, cost: 25, level: 30,  profession: 'Archer' },
    { name: 'anti-magic burst', spellPower: 2, weight: 40, cost: 35, level: 65,  profession: 'Archer' },
    { name: 'anti-magic blast', spellPower: 3, weight: 40, cost: 45, level: 100, profession: 'Archer',
      collectibles: ['Ivory Arrow'] }
  ];

  static shouldCast(caster) {
    return this.$canTarget.enemyHasMp(caster);
  }

  calcDamage() {
    const min = (this.caster.liveStats.int + (this.caster.liveStats.dex * 0.25)) * 0.2;
    const max = (this.caster.liveStats.int + (this.caster.liveStats.dex * 0.25)) * 0.4;
    return this.minMax(min, max) * this.spellPower;
  }

  determineTargets() {
    return this.$targetting.enemyWithMostMp;
  }

  preCast() {
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = this.calcDamage();

      const lostMp = Math.floor(target._mp.maximum * (25 * (this.spellPower+1)/100));
      target._mp.sub(lostMp);
      const message = `%player used an %spellName on %targetName and dealt %damage damage and reduced %targetName\'s mp by ${lostMp}!`;

      super.cast({
        damage,
        message,
        targets: [target]
      });
    });
  }
}
