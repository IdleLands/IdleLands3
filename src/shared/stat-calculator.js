
import _ from 'lodash';
import { SETTINGS } from '../static/settings';

export const SPECIAL_STATS_BASE = [
  { name: 'hpregen',         desc: 'Regenerate HP every combat round.', enchantMax: 100 },
  { name: 'mpregen',         desc: 'Regenerate MP every combat round.', enchantMax: 100 },
  { name: 'damageReduction', desc: 'Take 1 fewer damage per point from some sources. Stacks intensity.', enchantMax: 100 },
  { name: 'crit',            desc: '+1% crit chance. Stacks intensity.', enchantMax: 1 },
  { name: 'dance',           desc: '+50% dodge chance.', enchantMax: 1 },
  { name: 'deadeye',         desc: '+50% chance to beat opponent dodge.', enchantMax: 1 },
  { name: 'offense',         desc: '+10% offensive combat rolls. Stacks intensity.', enchantMax: 1 },
  { name: 'defense',         desc: '+10% defensive combat rolls. Stacks intensity.', enchantMax: 1 },
  { name: 'lethal',          desc: '+50% critical damage.', enchantMax: 1 },
  { name: 'aegis',           desc: 'Negates critical hits.', enchantMax: 1 },
  { name: 'silver',          desc: '+10% minimum attack damage.', enchantMax: 1 },
  { name: 'power',           desc: '+10% maximum attack damage.', enchantMax: 1 },
  { name: 'vorpal',          desc: '+10% critical chance.', enchantMax: 1 },
  { name: 'glowing',         desc: '+5% to all physical combat rolls. Stacks intensity.', enchantMax: 1 },
  { name: 'sentimentality',  desc: '1 sentimentality = 1 score', enchantMax: 500 }
];

export const ATTACK_STATS_BASE = [
  { name: 'prone',           desc: '+5% chance of stunning an opponent for 1 round.', enchantMax: 1 },
  { name: 'venom',           desc: '+5% chance of inflicting venom (DoT, % of target HP) on an enemy. Stacks intensity.', enchantMax: 1 },
  { name: 'poison',          desc: '+5% chance of inflicting poison (DoT, based on caster INT) on an enemy. Stacks intensity.', enchantMax: 1 },
  { name: 'shatter',         desc: '+5% chance of inflicting shatter (-10% CON/DEX/AGI) on an enemy. Stacks intensity.', enchantMax: 1 },
  { name: 'vampire',         desc: '+5% chance of inflicting vampire (health drain) on an enemy. Stacks intensity.', enchantMax: 1 }
];

export const BASE_STATS = ['str', 'con', 'dex', 'int', 'agi', 'luk'];
export const SPECIAL_STATS = _.map(SPECIAL_STATS_BASE, 'name');
export const ATTACK_STATS = _.map(ATTACK_STATS_BASE, 'name');

export class StatCalculator {

  static _reduction(stat, args = [], baseValue = 0) {
    return baseValue + this._baseStat(args[0], stat);
  }

  static _secondPassFunctions(player, stat) {
    const possibleFunctions = [player.$profession.classStats]
      .concat(this._achievementFunctions(player, stat))
      .concat(this._personalityFunctions(player, stat));

    return _(possibleFunctions)
      .map(stat)
      .filter(_.isFunction)
      .compact()
      .value();
  }

  static _baseStat(player, stat) {
    return this.classStat(player, stat)
         + this.effectStat(player, stat)
         + this.equipmentStat(player, stat)
         + this.professionStat(player, stat)
         + this.achievementStat(player, stat)
         + this.personalityStat(player, stat);
  }

  static equipmentStat(player, stat) {
    return _(player.equipment)
      .values()
      .flatten()
      .map(item => _.isNumber(item[stat]) ? item[stat] : 0)
      .sum();
  }

  static professionStat(player, stat) {
    const base = player.$profession.classStats[stat];
    if(!base || _.isFunction(base)) return 0;
    return base;
  }

  static effectStat(player, stat) {
    return _(player.$effects.effects)
      .map(effect => effect[stat] || 0)
      .sum();
  }

  static classStat(player, stat) {
    return player.level * (player.$profession[`base${_.capitalize(stat)}PerLevel`] || 0);
  }

  static _achievementFunctions(player, stat) {
    if(!player.$achievements) return [];
    return _(player.$achievements.achievements)
      .values()
      .map('rewards')
      .flattenDeep()
      .reject(bonus => bonus.type !== 'stats')
      .reject(bonus => !bonus[stat])
      .value();
  }

  static achievementStat(player, stat) {
    if(!player.$achievements) return 0;
    return _(player.$achievements.achievements)
      .values()
      .map('rewards')
      .flattenDeep()
      .reject(bonus => bonus.type !== 'stats')
      .reject(bonus => !bonus[stat] || _.isFunction(bonus[stat]))
      .reduce((prev, cur) => prev+(+cur[stat]), 0);
  }

  static _personalityFunctions(player) {
    if(!player.$achievements) return [];
    return _(player.$personalities._activePersonalityData())
      .map('stats')
      .value();
  }

  static personalityStat(player, stat) {
    if(!player.$personalities) return 0;
    return _(player.$personalities._activePersonalityData())
      .reject(pers => !pers.stats[stat] || _.isFunction(pers.stats[stat]))
      .map(pers => pers.stats[stat])
      .sum();
  }

  static stat(player, stat) {
    let mods = 0;
    const baseValue = this._baseStat(player, stat);

    const functions = this._secondPassFunctions(player, stat);
    _.each(functions, func => mods += func(player, baseValue));

    return Math.floor(baseValue + mods);
  }

  static gold(player) {
    return this._baseStat(player, 'gold');
  }

  static xp(player) {
    return this._baseStat(player, 'xp');
  }

  static hp(player) {
    const level = player.level;
    const prof = player.$profession;
    return Math.max(1,
           prof.baseHpPerLevel * level
        +  prof.baseHpPerStr * this.stat(player, 'str')
        +  prof.baseHpPerCon * this.stat(player, 'con')
        +  prof.baseHpPerDex * this.stat(player, 'dex')
        +  prof.baseHpPerAgi * this.stat(player, 'agi')
        +  prof.baseHpPerInt * this.stat(player, 'int')
        +  prof.baseHpPerLuk * this.stat(player, 'luk')
        +  this.stat(player, 'hp')
    );
  }

  static mp(player) {
    const level = player.level;
    const prof = player.$profession;
    return Math.max(0,
           prof.baseMpPerLevel * level
        +  prof.baseMpPerStr * this.stat(player, 'str')
        +  prof.baseMpPerCon * this.stat(player, 'con')
        +  prof.baseMpPerDex * this.stat(player, 'dex')
        +  prof.baseMpPerAgi * this.stat(player, 'agi')
        +  prof.baseMpPerInt * this.stat(player, 'int')
        +  prof.baseMpPerLuk * this.stat(player, 'luk')
        +  this.stat(player, 'mp')
      );
  }

  static overcomeDodge(player) {
    return (1 + (this.stat(player, 'deadeye') > 0 ? 1.5 : 1) +
                (this.stat(player, 'glowing') * 0.05) +
                (this.stat(player, 'offense') * 0.1)) *
      Math.max(10, (
          this.stat(player, 'str')
        + this.stat(player, 'dex')
        + this.stat(player, 'con')
        + this.stat(player, 'int')
        + this.stat(player, 'agi')
        + this.stat(player, 'luk')
      ));
  }

  static dodge(player) {
    return (1 + (this.stat(player, 'dance') > 0 ? 1.5 : 1) +
                (this.stat(player, 'glowing') * 0.05) +
                (this.stat(player, 'defense') * 0.1)) *
      (
        this.stat(player, 'agi')
      + this.stat(player, 'luk')
      ) / 8;
  }

  static hit(player) {
    return (1 + (this.stat(player, 'offense') * 0.1) +
                (this.stat(player, 'glowing') * 0.05)) *
      Math.max(10, (
        this.stat(player, 'str')
      + this.stat(player, 'dex')
    ) / 2);
  }

  static avoidHit(player) {
    return (1 + (this.stat(player, 'defense') * 0.1) +
                (this.stat(player, 'glowing') * 0.05)) *
      (
          this.stat(player, 'agi')
        + this.stat(player, 'dex')
        + this.stat(player, 'con')
        + this.stat(player, 'int')
      ) / 16;
  }

  static deflect(player) {
    return this.stat(player, 'luk');
  }

  static itemValueMultiplier(player) {
    const baseValue = SETTINGS.reductionDefaults.itemValueMultiplier;
    const reducedValue = this._reduction('itemValueMultiplier', [player], baseValue);
    return reducedValue;

  }

  static itemFindRange(player) {
    const baseValue = (player.level+1) * SETTINGS.reductionDefaults.itemFindRange;
    const reducedValue = this._reduction('itemFindRange', [player], baseValue);
    return Math.floor(reducedValue * this.itemFindRangeMultiplier(player));
  }

  static itemFindRangeMultiplier(player) {
    const baseValue = 1 + (0.2 * Math.floor(player.level/10)) + SETTINGS.reductionDefaults.itemFindRangeMultiplier;
    return this._reduction('itemFindRangeMultiplier', [player], baseValue);
  }

  static merchantItemGeneratorBonus(player) {
    const baseValue = SETTINGS.reductionDefaults.merchantItemGeneratorBonus;
    return this._reduction('merchantItemGeneratorBonus', [player], baseValue);
  }

  static merchantCostReductionMultiplier(player) {
    const baseValue = SETTINGS.reductionDefaults.merchantCostReductionMultiplier;
    return this._reduction('merchantCostReductionMultiplier', [player], baseValue);
  }

  static isStunned(player) {
    const isStunned = _.filter(player.$effects.effects, effect => effect.stun);
    if(isStunned.length > 0) {
      return isStunned[0].stunMessage || 'NO STUN MESSAGE';
    }
  }
}