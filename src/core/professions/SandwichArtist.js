
import { Profession } from '../base/profession';

export class SandwichArtist extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 90;
  static baseMpPerLevel = Profession.baseMpPerLevel + 30;

  static baseMpPerInt = 12;

  static baseConPerLevel = 1;
  static baseDexPerLevel = 5;
  static baseAgiPerLevel = 1;
  static baseStrPerLevel = 3;
  static baseIntPerLevel = 1;

  static classStats = {
    mpregen: (target) => target._mp.maximum * 0.025
  }
}