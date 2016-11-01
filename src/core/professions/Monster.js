
import { Profession } from '../base/profession';

export class Monster extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 240;
  static baseMpPerLevel = Profession.baseMpPerLevel + 5;

  static baseConPerLevel = 4;
  static baseDexPerLevel = 4;
  static baseAgiPerLevel = 4;
  static baseStrPerLevel = 4;
  static baseIntPerLevel = 4;
}