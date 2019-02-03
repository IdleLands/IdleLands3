"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Fighter extends profession_1.Profession {
}
Fighter.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 150;
Fighter.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 18;
Fighter.baseMpPerStr = 6;
Fighter.baseMpPerInt = 6;
Fighter.baseConPerLevel = 2;
Fighter.baseDexPerLevel = 4;
Fighter.baseAgiPerLevel = 3;
Fighter.baseStrPerLevel = 5;
Fighter.baseIntPerLevel = 1;
Fighter.classStats = {
    hpregen: (target) => target._hp.maximum * 0.0075,
    prone: 1
};
exports.Fighter = Fighter;
