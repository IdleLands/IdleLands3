"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class MagicalMonster extends profession_1.Profession {
}
MagicalMonster.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
MagicalMonster.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 75;
MagicalMonster.baseMpPerInt = 120;
MagicalMonster.baseConPerLevel = 2;
MagicalMonster.baseDexPerLevel = 2;
MagicalMonster.baseAgiPerLevel = 2;
MagicalMonster.baseStrPerLevel = 2;
MagicalMonster.baseIntPerLevel = 2;
exports.MagicalMonster = MagicalMonster;
