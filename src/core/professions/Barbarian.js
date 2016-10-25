
import { Profession } from '../base/profession';

export class Barbarian extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel + 35;
  static baseMpPerLevel = Profession.baseMpPerLevel + 1;

  static baseHpPerStr = 3;
  static baseHpPerCon = 2;

  static baseConPerLevel = 6;
  static baseDexPerLevel = 1;
  static baseAgiPerLevel = 1;
  static baseStrPerLevel = 6;
  static baseIntPerLevel = -5;

  static classStats = {
    hpregen: (target) => target._hp.maximum * 0.01,
    damageReduction: (target) => target.level * 10,
    dex: (target, baseValue) => -baseValue * 0.5,
    agi: (target, baseValue) => -baseValue * 0.5,
    str: (target, baseValue) => baseValue * target.special / 100
  }

  static setupSpecial(target) {
    target._special.name = 'Rage';
    target._special.set(0);
    target._special.maximum = 100;
    target.recalculateStats(['str']);
  }

  static resetSpecial(target) {
    super.resetSpecial(target);
    if (target.$dirty) { target.$dirty.flags.str = true; }
  }

  static _eventSelfAttacked(target) {
    target._special.add(5);
  }

  static _eventSelfAttack(target) {
    target._special.sub(2);
  }

  static _eventAllyKilled(target) {
    target._special.add(10);
  }

  static _eventSelfKilled(target) {
    target._special.toMinimum();
  }

  static _eventSelfKill(target) {
    target._special.sub(15);
  }
}