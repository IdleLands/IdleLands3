
import { Profession } from '../base/profession';

export class Rogue extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 5;
  static baseMpPerLevel = Profession.baseMpPerLevel + 5;

  static baseHpPerDex = 1;
  static baseMpPerDex = 1;

  static baseConPerLevel = 2;
  static baseDexPerLevel = 4;
  static baseAgiPerLevel = 4;
  static baseStrPerLevel = 2;
  static baseIntPerLevel = 1;

  static classStats = {
    poison: 1,
    venom: 1,
    shatter: 1,
    vampire: 1,
    prone: 1
  }
}