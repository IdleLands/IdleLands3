
import { Profession } from '../base/profession';

export class Fighter extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 25;
  static baseMpPerLevel = Profession.baseMpPerLevel + 3;

  static baseConPerLevel = 2;
  static baseDexPerLevel = 4;
  static baseAgiPerLevel = 3;
  static baseStrPerLevel = 5;
  static baseIntPerLevel = 1;
  static baseWisPerLevel = 1;
}