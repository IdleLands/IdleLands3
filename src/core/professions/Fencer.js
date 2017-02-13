
import { Profession } from '../base/profession';

export class Fencer extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel;
  static baseMpPerLevel = Profession.baseMpPerLevel;

  static baseHpPerCon = 1;
  static baseHpPerDex = 10;

  static baseConPerLevel = 1;
  static baseDexPerLevel = 7;
  static baseAgiPerLevel = 1;
  static baseStrPerLevel = 1;
  static baseIntPerLevel = 1;
  static baseLukPerLevel = 1;
}