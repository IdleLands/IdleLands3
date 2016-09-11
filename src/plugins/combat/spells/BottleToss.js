
import _ from 'lodash';

import { Spell, SpellType } from '../spell';

export class BottleToss extends Spell {
  static description = 'Throw a bottle at a target, dealing damage based on STR, CON, and # of Bottles. Has a chance of throwing multiple bottles. Requires and consumes 9 bottles each throw. Deals 1.5x damage if the Drunk personality is activated.';
  static element = SpellType.DEBUFF;
  static stat = 'special';
  static tiers = [
    { name: 'bottle toss',    spellPower: 1,  weight: 25, cost: 0,   profession: 'Pirate', level: 1 }
  ];

  static shouldCast(caster) {
    return caster.special > 9;
  }

  determineTargets() {
    return this.$targetting.randomEnemy;
  }

  calcDamage() {
    const drunkMultiplier = this.caster.$personalities && this.caster.$personalities.isActive('Drunk') ? 1.5 : 1;
    const bottlesBonus = (this.caster._special.asPercent()/100) * this.caster.liveStats.con;
    const min = (bottlesBonus + this.caster.liveStats.str) * 0.35 * drunkMultiplier;
    const max = (bottlesBonus + this.caster.liveStats.str) * 0.85 * drunkMultiplier;
    return this.minMax(min, max) * this.spellPower;
  }

  preCast() {
    const message = '%player begins singing "99 bottles of ale on the wall..."!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        targets: [target]
      });

      let tosses = 0;
      while(tosses === 0 || (this.caster.special > 9 && Spell.chance.bool({ likelihood: 50 }))) {
        tosses++;
        super.cast({
          damage: this.calcDamage(),
          message: '%player threw 9 bottles at %targetName, dealing %damage damage!',
          targets: [target]
        });
        this.caster._special.sub(9);
      }
    });
  }
}