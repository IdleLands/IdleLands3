
import { Profession } from '../base/profession';

export class Clockborg extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 400;
  static baseMpPerLevel = Profession.baseMpPerLevel + 10;

  static baseHpPerCon = 27;
  static baseMpPerInt = 27;

  static baseConPerLevel = 1;
  static baseDexPerLevel = 1;
  static baseAgiPerLevel = 1;
  static baseStrPerLevel = 6;
  static baseIntPerLevel = 6;
}