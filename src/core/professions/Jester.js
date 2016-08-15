
import { Profession } from '../base/profession';

export class Jester extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel;
  static baseMpPerLevel = Profession.baseMpPerLevel;

  static baseHpPerLuk = 5;
  static baseMpPerLuk = 5;

  static baseConPerLevel = 0;
  static baseDexPerLevel = 0;
  static baseAgiPerLevel = 0;
  static baseStrPerLevel = 0;
  static baseIntPerLevel = 0;
  static baseLukPerLevel = 10;

  static str(player) { return player.liveStats.luk / 2; }
  static con(player) { return player.liveStats.luk / 3; }
  static dex(player) { return player.liveStats.luk / 4; }
  static agi(player) { return player.liveStats.luk / 4; }
  static int(player) { return player.liveStats.luk / 2; }
}