
import { Spell, SpellType } from '../spell';

export class MultiStrike extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'double strike', spellPower: 2, weight: 40, cost: 100,   level: 1,  profession: 'Fighter' },
    { name: 'triple strike', spellPower: 3, weight: 40, cost: 1000,  level: 50, profession: 'Fighter' },
    { name: 'double prod',   spellPower: 2, weight: 35, cost: 1000,  level: 15, profession: 'MagicalMonster',
      collectibles: ['Fighter\'s Manual'] }
  ];

  static shouldCast() {
    return this.$canTarget.yes();
  }

  preCast() {
    const message = '%player used %spellName!';

    super.cast({
      damage: 0,
      message,
      targets: []
    });

    for(let i = 0; i < this.spellPower; i++) {
      this.caster.$battle.doAttack(this.caster, 'Attack');
    }
  }
}