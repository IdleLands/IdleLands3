
import { Profession } from '../base/profession';

export class MagicalMonster extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel;
  static baseMpPerLevel = Profession.baseMpPerLevel + 75;

  static baseMpPerInt = 120;

  static baseConPerLevel = 2;
  static baseDexPerLevel = 2;
  static baseAgiPerLevel = 2;
  static baseStrPerLevel = 2;
  static baseIntPerLevel = 2;
}