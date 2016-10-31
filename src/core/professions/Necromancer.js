
import { Profession } from '../base/profession';

export class Necromancer extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 180;
  static baseMpPerLevel = Profession.baseMpPerLevel + 10;

  static baseMpPerInt = 12;
  static baseHpPerCon = 42

  static baseConPerLevel = 1;
  static baseDexPerLevel = 3;
  static baseAgiPerLevel = -3;
  static baseStrPerLevel = 3;
  static baseIntPerLevel = 8;
  static baseLukPerLevel = -1;

  static classStats = {
    mpregen: (target) => target._mp.maximum * 0.02,
    agi: (target, baseValue) => -baseValue * 0.1,
    con: (target, baseValue) => -baseValue * 0.25,
    prone: 1,
    venom: 1,
    poison: 1,
    vampire: 1
  }

  static setupSpecial(target) {
    target._special.name = 'Minions';
    target._special.set(0);
    target._special.maximum = Math.floor(target.level / 25) + 1;
  }
}