
import { Profession } from '../base/profession';

export class Jester extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel;
  static baseMpPerLevel = Profession.baseMpPerLevel;

  static baseHpPerLuk = 10;
  static baseMpPerLuk = 10;

  static baseConPerLevel = 0;
  static baseDexPerLevel = 0;
  static baseAgiPerLevel = 0;
  static baseStrPerLevel = 0;
  static baseIntPerLevel = 0;
  static baseLukPerLevel = 10;
}