
import { Profession } from '../base/profession';

export class Bitomancer extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 10;
  static baseMpPerLevel = Profession.baseMpPerLevel + 15;

  static baseMpPerInt = 5;

  static baseConPerLevel = 1;
  static baseDexPerLevel = 3;
  static baseAgiPerLevel = 1;
  static baseStrPerLevel = 1;
  static baseIntPerLevel = 7;
}