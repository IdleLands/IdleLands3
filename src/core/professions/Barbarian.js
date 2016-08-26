
import { Profession } from '../base/profession';

export class Barbarian extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 35;
  static baseMpPerLevel = Profession.baseMpPerLevel + 1;

  static baseHpPerStr = 3;
  static baseHpPerCon = 2;

  static baseConPerLevel = 6;
  static baseDexPerLevel = 1;
  static baseAgiPerLevel = 1;
  static baseStrPerLevel = 6;
  static baseIntPerLevel = -5;

  static classStats = {
    hpregen: (target) => target._hp.maximum * 0.01,
    damageReduction: (target) => target.level * 10,
    dex: (target, baseValue) => -baseValue * 0.5,
    agi: (target, baseValue) => -baseValue * 0.5
  }
}