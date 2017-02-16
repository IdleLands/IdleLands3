
import _ from 'lodash';

import Chance from 'chance';
const chance = new Chance();

import * as Professions from '../core/professions/_all';

import { ItemGenerator } from './item-generator';

import { Generator } from '../core/base/generator';
import { Equipment } from '../core/base/equipment';
import { ObjectAssets } from '../shared/asset-loader';

import Bosses from '../../assets/maps/content/boss.json';
import BossParties from '../../assets/maps/content/bossparties.json';
import BossItems from '../../assets/maps/content/bossitems.json';

const bossTimers = {};

export class MonsterGenerator extends Generator {

  static _setBossTimer(name) {
    const respawn = Bosses[name] ? Bosses[name].respawn : BossParties[name].respawn;
    bossTimers[name] = Date.now() + (1000 * respawn);
  }

  static _isBossAlive(name) {
    return bossTimers[name] ? bossTimers[name] - Date.now() < 0 : true;
  }

  static generateBoss(name, forPlayer) {
    const boss = _.cloneDeep(Bosses[name]);
    if(!this._isBossAlive(name)) return;
    boss.stats.name = `${name}`;
    boss.stats._name = `${name}`;
    const monster = this.augmentMonster(boss.stats, forPlayer);
    monster.$isBoss = true;
    this.equipBoss(monster, boss.items);
    monster._collectibles = boss.collectibles;
    return [monster];
  }

  static generateBossParty(name, forPlayer) {
    const bossparty = BossParties[name];
    if(!this._isBossAlive(name)) return;
    return _.map(bossparty.members, member => {
      const boss = _.cloneDeep(Bosses[member]);
      boss.stats.name = `${member}`;
      boss.stats._name = `${member}`;
      const monster = this.augmentMonster(boss.stats, forPlayer);
      monster.$isBoss = true;
      this.equipBoss(monster, boss.items);
      monster._collectibles = boss.collectibles;
      return monster;
    });
  }

  static equipBoss(monster, items) {
    if(!items || !items.length) return;
    _.each(items, item => {
      const itemInst = new Equipment(BossItems[item.name]);
      itemInst.name = item.name;
      itemInst.itemClass = 'guardian';
      itemInst.dropPercent = item.dropPercent;
      ItemGenerator.tryToVectorize(itemInst, monster.level);
      monster.equip(itemInst);
    });
  }

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
      const item = ItemGenerator.generateItem(type, monster.level * 15, monster.level);

      if(monster.canEquip(item, monster.level / 2, false)) {
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
    if(!baseMonster.professionName || baseMonster.professionName.toLowerCase() === 'random') {
      baseMonster.professionName = _.sample(_.keys(Professions));
    }

    // TODO personalities
    // TODO other additions

    if(baseMonster.name && chance.bool({ likelihood: 1 })) {
      const chanceOpts = { prefix: chance.bool(), suffix: chance.bool(), middle: chance.bool() };
      if(baseMonster.gender) {
        chanceOpts.gender = _.sample(['male', 'female']);
      }
      baseMonster.name = `${chance.name(chanceOpts)}, the ${baseMonster.name}`;
    }

    const Monster = require('../plugins/combat/monster').Monster;
    const monster = new Monster();

    if(baseMonster.mirror) {
      baseMonster.professionName = forPlayer && forPlayer.professionName ? forPlayer.professionName : 'Monster';
      baseMonster.level = forPlayer && forPlayer.professionName ? forPlayer.level : baseMonster.level;
    }

    monster.init(baseMonster);

    if(baseMonster.mirror && forPlayer) {
      _.each(_.values(forPlayer.equipment), item => {
        const cloned = _.cloneDeep(item);
        monster.equip(cloned);
      });

    } else {
      this.equipMonster(monster, baseMonster);
    }

    return monster;
  }
}
