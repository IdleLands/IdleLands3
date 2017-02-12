
import { Profession } from '../base/profession';

export class Druid extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 50;
  static baseMpPerLevel = Profession.baseMpPerLevel + 50;

  static baseMpPerInt = 26;

  static baseConPerLevel = 8;
  static baseDexPerLevel = 2;
  static baseAgiPerLevel = 2;
  static baseStrPerLevel = 2;
  static baseIntPerLevel = 4;

  static classStats = {
    mpregen: (target) => target._mp.maximum * 0.01
  }
}