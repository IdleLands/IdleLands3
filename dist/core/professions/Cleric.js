"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Cleric extends profession_1.Profession {
}
Cleric.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 60;
Cleric.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 60;
Cleric.baseMpPerInt = 30;
Cleric.baseConPerLevel = 4;
Cleric.baseDexPerLevel = 2;
Cleric.baseAgiPerLevel = 2;
Cleric.baseStrPerLevel = 3;
Cleric.baseIntPerLevel = 6;
Cleric.classStats = {
    mpregen: (target) => target._mp.maximum * 0.01
};
exports.Cleric = Cleric;
