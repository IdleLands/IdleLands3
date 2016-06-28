
import { Profession } from '../base/profession';

export class Cleric extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 10;
  static baseMpPerLevel = Profession.baseMpPerLevel + 10;

  static baseMpPerWis = 5;

  static baseConPerLevel = 4;
  static baseDexPerLevel = 2;
  static baseAgiPerLevel = 2;
  static baseStrPerLevel = 3;
  static baseIntPerLevel = 2;
  static baseWisPerLevel = 6;
}