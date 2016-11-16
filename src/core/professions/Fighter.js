
import { Profession } from '../base/profession';

export class Fighter extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 150;
  static baseMpPerLevel = Profession.baseMpPerLevel + 18;

  static baseMpPerStr = 6;
  static baseMpPerInt = 6;

  static baseConPerLevel = 2;
  static baseDexPerLevel = 4;
  static baseAgiPerLevel = 3;
  static baseStrPerLevel = 5;
  static baseIntPerLevel = 1;

  static classStats = {
    hpregen: (target) => target._hp.maximum * 0.0075,
    prone: 1
  }
}