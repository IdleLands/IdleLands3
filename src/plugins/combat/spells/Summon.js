
import _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { MonsterGenerator } from '../../../shared/monster-generator';

const monsters = {
  Necromancer: [
    { name: 'zombie', statMult: 0.5, slotCost: 1, restrictLevel: 5, restrictClasses: ['Monster'] },
    {
      name: 'skeleton',
      statMult: 0.8,
      slotCost: 1,
      restrictLevel: 25,
      restrictClasses: ['Generalist', 'Rogue', 'Mage', 'Cleric', 'Barbarian', 'Fighter', 'SandwichArtist']
    },
    { name: 'wraith', statMult: 1.1, slotCost: 1, restrictLevel: 55 },
    { name: 'vampire', statMult: 1.0, slotCost: 2, restrictLevel: 70, baseStats: { vampire: 10 } },
    { name: 'plaguebringer', statMult: 1.0, slotCost: 2, restrictLevel: 70, baseStats: { venom: 10 } },
    { name: 'ghoul', statMult: 1.0, slotCost: 2, restrictLevel: 70, baseStats: { poison: 10 } },
    {
      name: 'dracolich',
      statMult: 1.35,
      slotCost: 2,
      restrictLevel: 85,
      baseStats: { mirror: 1 },
      requireCollectibles: ['Undead Dragon Scale']
    },
    { name: 'demogorgon', statMult: 1.75, slotCost: 4, restrictLevel: 150, requireCollectibles: ['Gorgon Snake'] }
  ]
};

export class Summon extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'summon',  spellPower: 1, weight: 90, cost: 350,  level: 25,  profession: 'Necromancer' }
  ];

  static shouldCast(caster) {
    return caster.isPlayer && !caster._special.atMaximum();
  }

  determineTargets() {
    return this.$targetting.self;
  }

  chooseValidMonster() {
    return _(monsters[this.caster.professionName])
      .reject(mon => mon.restrictLevel > this.caster.level)
      .reject(mon => this.caster.$collectibles && mon.requireCollectibles && !_.every(mon.requireCollectibles, col => this.caster.$collectibles.hasCollectible(col)))
      .reject(mon => mon.slotCost > this.caster._special.maximum - this.caster.special)
      .sample();
  }

  preCast() {
    const baseMonster = _.cloneDeep(this.chooseValidMonster());
    baseMonster.level = Math.floor(this.caster.level / 2);
    _.extend(baseMonster, baseMonster.baseStats);

    if(baseMonster.restrictClasses) {
      baseMonster.class = _.sample(baseMonster.restrictClasses);
    }

    const mimicTarget = this.$targetting.strongestEnemyScore;

    const summonedMonster = MonsterGenerator.augmentMonster(baseMonster, mimicTarget);
    summonedMonster.name = `${this.caster.fullname}'s ${summonedMonster.name}`;
    summonedMonster.isPet = true;

    this.caster.party.playerJoin(summonedMonster);
    this.caster.$battle._setupPlayer(summonedMonster);

    summonedMonster._eventSelfKilled = () => {
      this.caster._special.sub(baseMonster.slotCost);
      this.caster.party.playerLeave(summonedMonster);
      this._emitMessage(this.caster, '%targetName exploded into a pile of arcane dust!', { targetName: summonedMonster.fullname });
    };

    const message = `%player used %spellName and spawned a ${baseMonster.name}!`;

    this.caster._special.add(baseMonster.slotCost);

    super.cast({
      damage: 0,
      message,
      targets: [this.caster]
    });
  }
}
