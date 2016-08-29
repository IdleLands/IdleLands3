
import { Profession } from '../base/profession';

// TODO needs to be an attack that steals other peoples bandwidth (and if they're a bitomancer, drains their special)
// TODO call it freeleech, make it hit everyone, costs 0

export class Bitomancer extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 10;

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