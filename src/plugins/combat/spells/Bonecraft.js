
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class Bonecraft extends Spell {
  static element = SpellType.HEAL;
  static tiers = [
    { name: 'bonecraft',     spellPower: 25, weight: 100, cost: 25000,  level: 80,   profession: 'Necromancer',
      collectibles: ['Necronomicon'] }
  ];

  static shouldCast(caster) {
    return this.$canTarget.anyBonecraftable(caster);
  }

  determineTargets() {
    return this.$targetting.randomBonecraftable;
  }

  preCast() {
    const message = '%player cast %spellName at %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      const damage = -Math.round(target._hp.maximum * this.spellPower/100);

      if(!target.$prevParty) {
        target.$prevParty = target.party;
      }
      target.party.playerLeave(target);
      this.caster.party.playerJoin(target);

      super.cast({
        damage,
        message,
        targets: [target]
      });
    });
  }
}