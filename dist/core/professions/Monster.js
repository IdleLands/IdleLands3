"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Monster extends profession_1.Profession {
}
Monster.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 240;
Monster.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 30;
Monster.baseConPerLevel = 4;
Monster.baseDexPerLevel = 4;
Monster.baseAgiPerLevel = 4;
Monster.baseStrPerLevel = 4;
Monster.baseIntPerLevel = 4;
exports.Monster = Monster;
