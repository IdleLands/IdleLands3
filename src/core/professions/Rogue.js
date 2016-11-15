
import { Profession } from '../base/profession';

export class Rogue extends Profession {

  static baseHpPerLevel = Profession.baseHpPerLevel - 30;
  static baseMpPerLevel = Profession.baseMpPerLevel + 30;

  static baseHpPerDex = 6;
  static baseMpPerDex = 6;

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

  static setupSpecial(target) {
    target._special.name = 'Stamina';
    target._special.maximum = 100;
    target._special.toMaximum();
    this.resetSkillCombo(target);
  }

  static _eventSelfTakeTurn(target) {
    target._special.add(2);
    if(target.$lastComboSkillTurn > 0) target.$lastComboSkillTurn--;
  }

  static updateSkillCombo(target, skillName) {
    target.$lastComboSkill = skillName;
    target.$lastComboSkillTurn = 4;
  }

  static resetSkillCombo(target) {
    target.$lastComboSkill = null;
    target.$lastComboSkillTurn = 0;
  }
}