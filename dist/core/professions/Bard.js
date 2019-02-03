"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Bard extends profession_1.Profession {
}
Bard.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 30;
Bard.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 30;
Bard.baseMpPerInt = 30;
Bard.baseConPerLevel = 1;
Bard.baseDexPerLevel = 1;
Bard.baseAgiPerLevel = 3;
Bard.baseStrPerLevel = 2;
Bard.baseIntPerLevel = 3;
Bard.classStats = {
    mpregen: (target) => target._mp.maximum * 0.005
};
exports.Bard = Bard;
