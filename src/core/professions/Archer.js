
import { Profession } from '../base/profession';

export class Archer extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 15;
  static baseMpPerLevel = Profession.baseMpPerLevel + 10;

  static baseHpPerDex = 3;
  static baseMpPerDex = 3;

  static baseConPerLevel = 2;
  static baseDexPerLevel = 4;
  static baseAgiPerLevel = 3;
  static baseStrPerLevel = 2;
  static baseIntPerLevel = 1;
  static baseWisPerLevel = 1;
}