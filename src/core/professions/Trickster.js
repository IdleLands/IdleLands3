
import { Profession } from '../base/profession';

export class Trickster extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel;
  static baseMpPerLevel = Profession.baseMpPerLevel;

  static baseHpPerCon = 5;
  static baseHpPerLuk = 10;
  static baseMpPerLuk = 10;

  static baseConPerLevel = 1;
  static baseDexPerLevel = 1;
  static baseAgiPerLevel = 1;
  static baseStrPerLevel = 1;
  static baseIntPerLevel = 1;
  static baseLukPerLevel = 5;

  static str(player) { return player.liveStats.luk / 10; }
  static con(player) { return player.liveStats.luk / 10; }
  static dex(player) { return player.liveStats.luk / 10; }
  static agi(player) { return player.liveStats.luk / 10; }
  static int(player) { return player.liveStats.luk / 10; }

  static setupSpecial(target) {
    target._special.name = 'Cards';
    target._special.maximum = 54;
    target._special.toMaximum();
  }
}