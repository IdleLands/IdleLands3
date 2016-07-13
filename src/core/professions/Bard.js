
import { Profession } from '../base/profession';

export class Bard extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 5;
  static baseMpPerLevel = Profession.baseMpPerLevel + 5;

  static baseConPerLevel = 1;
  static baseDexPerLevel = 1;
  static baseAgiPerLevel = 3;
  static baseStrPerLevel = 2;
  static baseIntPerLevel = 3;
}