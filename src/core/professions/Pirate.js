
import { Profession } from '../base/profession';

export class Pirate extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 30;
  static baseMpPerLevel = Profession.baseMpPerLevel + 5;

  static baseHpPerCon = 3;
  static baseHpPerStr = 1;
  static baseMpPerInt = 5;

  static baseConPerLevel = 3;
  static baseDexPerLevel = 2;
  static baseAgiPerLevel = 2;
  static baseStrPerLevel = 3;
  static baseIntPerLevel = 1;
}