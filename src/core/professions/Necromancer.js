
import { Profession } from '../base/profession';

export class Necromancer extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 30;
  static baseMpPerLevel = Profession.baseMpPerLevel + 10;

  static baseMpPerInt = 5;
  static baseMpPerWis = 10;

  static baseConPerLevel = 0;
  static baseDexPerLevel = 3;
  static baseAgiPerLevel = -2;
  static baseStrPerLevel = 3;
  static baseIntPerLevel = 8;
  static baseLukPerLevel = -1;
}