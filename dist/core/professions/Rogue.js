"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Rogue extends profession_1.Profession {
    static setupSpecial(target) {
        target._special.name = 'Stamina';
        target._special.maximum = 100;
        target._special.toMaximum();
        this.resetSkillCombo(target);
    }
    static _eventSelfTakeTurn(target) {
        target._special.add(2);
        if (target.$lastComboSkillTurn > 0)
            target.$lastComboSkillTurn--;
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
Rogue.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 30;
Rogue.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 30;
Rogue.baseHpPerDex = 6;
Rogue.baseMpPerDex = 6;
Rogue.baseConPerLevel = 2;
Rogue.baseDexPerLevel = 4;
Rogue.baseAgiPerLevel = 4;
Rogue.baseStrPerLevel = 2;
Rogue.baseIntPerLevel = 1;
Rogue.classStats = {
    poison: 1,
    venom: 1,
    shatter: 1,
    vampire: 1,
    prone: 1
};
exports.Rogue = Rogue;
