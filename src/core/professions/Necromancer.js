
import { Profession } from '../base/profession';

export class Necromancer extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 30;
  static baseMpPerLevel = Profession.baseMpPerLevel + 10;

  static baseMpPerInt = 12;

  static baseConPerLevel = 0;
  static baseDexPerLevel = 3;
  static baseAgiPerLevel = -2;
  static baseStrPerLevel = 3;
  static baseIntPerLevel = 8;
  static baseLukPerLevel = -1;

  static setupSpecial(target) {
    target._special.name = 'Minions';
    target._special.set(0);
    target._special.maximum = Math.floor(target.level / 25) + 1;
  }
}