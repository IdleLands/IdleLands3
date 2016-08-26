
import { Profession } from '../base/profession';

export class Generalist extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel;
  static baseMpPerLevel = Profession.baseMpPerLevel + 3;

  static baseMpPerInt = 3;

  static baseConPerLevel = 3;
  static baseDexPerLevel = 3;
  static baseAgiPerLevel = 3;
  static baseStrPerLevel = 3;
  static baseIntPerLevel = 3;

  static classStats = {
    mpregen: (target) => target._mp.maximum * 0.005
  }
}