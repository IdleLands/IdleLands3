"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Fencer extends profession_1.Profession {
}
Fencer.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Fencer.baseMpPerLevel = profession_1.Profession.baseMpPerLevel;
Fencer.baseHpPerCon = 1;
Fencer.baseHpPerDex = 10;
Fencer.baseConPerLevel = 1;
Fencer.baseDexPerLevel = 7;
Fencer.baseAgiPerLevel = 1;
Fencer.baseStrPerLevel = 1;
Fencer.baseIntPerLevel = 1;
Fencer.baseLukPerLevel = 1;
exports.Fencer = Fencer;
