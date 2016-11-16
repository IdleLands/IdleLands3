
import { Profession } from '../base/profession';

export class Bard extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 30;
  static baseMpPerLevel = Profession.baseMpPerLevel + 30;

  static baseMpPerInt = 30;

  static baseConPerLevel = 1;
  static baseDexPerLevel = 1;
  static baseAgiPerLevel = 3;
  static baseStrPerLevel = 2;
  static baseIntPerLevel = 3;

  static classStats = {
    mpregen: (target) => target._mp.maximum * 0.005
  }
}