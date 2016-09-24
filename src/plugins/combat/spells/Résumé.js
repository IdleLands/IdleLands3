
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { StillAngry } from '../effects/StillAngry';

export class Résumé extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'résumé',  spellPower: 1, weight: 30, cost: 10,  level: 1,  profession: 'SandwichArtist' }
  ];

  static shouldCast(caster) {
    return caster._hp.lessThanPercent(25) && this.$canTarget.enemyWithoutEffect(caster, 'StillAngry');
  }

  determineTargets() {
    return this.$targetting.randomEnemyWithoutEffect('StillAngry');
  }

  calcDamage() {
    return 0;
  }

  calcPotency() {
    return 100;
  }

  calcDuration() {
    return 1;
  }

  preCast() {
    let message = 'Out of desperation, %player gave a %spellName to %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const goldRequired = this.caster.level * 100;

      const castOpts = {
        damage: 0,
        targets: [target]
      };

      if(target.gold > goldRequired) {
        message = `${message} %targetName hired %player and gave %himher a part-time gig! [+${goldRequired} gold]`;
        target.gainGold(-goldRequired, false);
        this.caster.gainGold(goldRequired, false);
      } else {
        message = `${message} %targetName declined, and got shoved into the ground by %player!`;
        castOpts.applyEffect = StillAngry;
      }

      castOpts.message = message;

      super.cast(castOpts);
    });
  }
}