
import _ from 'lodash';

export class StatCalculator {
  static _secondPassFunctions(player, stat) {
    const possibleFunctions = [player.$profession];
    return _(possibleFunctions)
      .map(stat)
      .filter(_.isFunction)
      .compact()
      .value();
  }

  static _baseStat(player, stat) {
    return this.classStat(player, stat)
         + this.equipmentStat(player, stat);
  }

  static equipmentStat(player, stat) {
    return _(player.equipment)
      .values()
      .map(item => _.isNumber(item[stat]) ? item[stat] : 0)
      .sum();
  }

  static classStat(player, stat) {
    return player.level * player.$profession[`base${_.capitalize(stat)}PerLevel`];
  }

  static stat(player, stat) {
    let mods = 0;
    const baseValue = this._baseStat(player, stat);

    const functions = this._secondPassFunctions(player, stat);
    _.each(functions, func => mods += func(player, baseValue));

    return baseValue + mods;
  }

  static hp(player) {
    const level = player.level;
    const prof = player.$profession;
    return prof.baseHpPerLevel * level
        +  prof.baseHpPerStr * this.stat(player, 'str')
        +  prof.baseHpPerCon * this.stat(player, 'con')
        +  prof.baseHpPerDex * this.stat(player, 'dex')
        +  prof.baseHpPerAgi * this.stat(player, 'agi')
        +  prof.baseHpPerInt * this.stat(player, 'int')
        +  prof.baseHpPerLuk * this.stat(player, 'luk')
    ;
  }

  static mp(player) {
    const level = player.level;
    const prof = player.$profession;
    return prof.baseMpPerLevel * level
        +  prof.baseMpPerStr * this.stat(player, 'str')
        +  prof.baseMpPerCon * this.stat(player, 'con')
        +  prof.baseMpPerDex * this.stat(player, 'dex')
        +  prof.baseMpPerAgi * this.stat(player, 'agi')
        +  prof.baseMpPerInt * this.stat(player, 'int')
        +  prof.baseMpPerLuk * this.stat(player, 'luk')
      ;
  }
}