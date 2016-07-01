
import { Profession } from '../base/profession';

export class SandwichArtist extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 15;
  static baseMpPerLevel = Profession.baseMpPerLevel + 5;

  static baseConPerLevel = 1;
  static baseDexPerLevel = 5;
  static baseAgiPerLevel = 1;
  static baseStrPerLevel = 3;
  static baseIntPerLevel = 1;
}