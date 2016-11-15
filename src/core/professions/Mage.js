
import { Profession } from '../base/profession';

export class Mage extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 150;
  static baseMpPerLevel = Profession.baseMpPerLevel + 150;

  static baseMpPerInt = 42;

  static baseConPerLevel = 2;
  static baseDexPerLevel = 2;
  static baseAgiPerLevel = 2;
  static baseStrPerLevel = 2;
  static baseIntPerLevel = 6;

  static classStats = {
    mpregen: (target) => target._mp.maximum * 0.01
  }
}