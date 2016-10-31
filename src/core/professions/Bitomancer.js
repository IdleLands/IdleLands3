
import { Profession } from '../base/profession';

export class Bitomancer extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 60;

  static baseConPerLevel = 1;
  static baseDexPerLevel = 3;
  static baseAgiPerLevel = 1;
  static baseStrPerLevel = 1;
  static baseIntPerLevel = 7;

  static setupSpecial(target) {
    target._special.name = 'Bandwidth';
    target._special.maximum = Math.floor(56 * Math.pow(target.level, 2) / 50);
    target._special.toMaximum();
  }
}