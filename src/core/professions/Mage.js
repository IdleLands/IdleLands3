
import { Profession } from '../base/profession';

export class Mage extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 150;
  static baseMpPerLevel = Profession.baseMpPerLevel + 25;

  static baseMpPerInt = 7;

  static baseConPerLevel = 2;
  static baseDexPerLevel = 2;
  static baseAgiPerLevel = 2;
  static baseStrPerLevel = 2;
  static baseIntPerLevel = 6;

  static classStats = {
    mpregen: (target) => target._mp.maximum * 0.01
  }
}