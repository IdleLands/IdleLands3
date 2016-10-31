
import { Profession } from '../base/profession';

export class Archer extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 90;
  static baseMpPerLevel = Profession.baseMpPerLevel + 10;

  static baseHpPerCon = 18;
  static baseHpPerDex = 6;
  static baseMpPerDex = 3;

  static baseConPerLevel = 2;
  static baseDexPerLevel = 4;
  static baseAgiPerLevel = 3;
  static baseStrPerLevel = 2;
  static baseIntPerLevel = 1;

  static classStats = {
    dex: (target, baseValue) => baseValue * 0.25,
    shatter: 1,
    crit: 10
  }

  static setupSpecial(target) {
    target._special.name = 'Focus';
    target._special.maximum = 100 * (Math.floor(target.level / 100) + 1);
    target._special.set(Math.round(target._special.maximum / 2));
  }

  static _eventSelfAttacked(target) {
    target._special.sub(5);
  }

  static _eventSelfTakeTurn(target) {
    target._special.add(10);
  }
}