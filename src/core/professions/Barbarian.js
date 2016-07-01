
import { Profession } from '../base/profession';

export class Barbarian extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 35;
  static baseMpPerLevel = Profession.baseMpPerLevel + 1;

  static baseHpPerStr = 3;
  static baseHpPerCon = 2;

  static baseConPerLevel = 6;
  static baseDexPerLevel = 1;
  static baseAgiPerLevel = 1;
  static baseStrPerLevel = 6;
  static baseIntPerLevel = -5;
}