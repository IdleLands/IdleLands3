
import _ from 'lodash';

import Chance from 'chance';
const chance = new Chance();

import * as Professions from '../core/professions/_all';

import { Monster } from '../plugins/combat/monster';

import { ItemGenerator } from './item-generator';

import { Generator } from '../core/base/generator';
import { Equipment } from '../core/base/equipment';
import { ObjectAssets } from '../shared/asset-loader';

export class MonsterGenerator extends Generator {

  static generateMonsters(party) {
    return _.map(party.players, p => {
      return this.augmentMonster(this.pickMonster(p), p);
    });
  }

  static pickMonster(player) {
    return _.clone(
      _(ObjectAssets.monster)
        .reject(mon => mon.level > player.level + 5 || mon.level < player.level - 5)
        .sample()
    );
  }

  static equipMonster(monster, baseMonster) {

    // give it some equipment to defend itself with
    _.each(Generator.types, type => {
      const item = ItemGenerator.generateItem(type);

      if(monster.canEquip(item)) {
        monster.equip(item);
      }
    });

    // base stats = "monster essence"; always given to a monster after other equipment
    const baseEssence = _.pick(baseMonster, Generator.stats);
    baseEssence.type = 'essence';
    baseEssence.name = 'monster essence';
    const essence = new Equipment(baseEssence);
    monster.equip(essence);
  }

  static generateVectorMonster(forPlayer) {
    const profession = _.sample(_.keys(Professions));
    return {
      name: `Vector ${profession}`,
      class: profession,
      level: forPlayer.level
    };
  }


  static augmentMonster(baseMonster, forPlayer) {

    if(!baseMonster) baseMonster = this.generateVectorMonster(forPlayer);

    baseMonster.professionName = baseMonster.class;
    if(baseMonster.professionName === 'Random') {
      baseMonster.professionName = _.sample(_.keys(Professions));
    }

    // TODO personalities
    // TODO other additions

    if(baseMonster.name && chance.bool({ likelihood: 1 })) {
      const chanceOpts = { prefix: chance.bool(), suffix: chance.bool(), middle: chance.bool() };
      if(baseMonster.gender) {
        chanceOpts.gender = baseMonster.gender.toLowerCase();
      }
      baseMonster.name = `${chance.name(chanceOpts)}, the ${baseMonster.name}`;
    }

    const monster = new Monster();
    monster.init(baseMonster);

    this.equipMonster(monster, baseMonster, forPlayer);

    return monster;
  }
}