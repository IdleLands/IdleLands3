"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Generalist extends profession_1.Profession {
}
Generalist.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Generalist.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 18;
Generalist.baseMpPerInt = 18;
Generalist.baseConPerLevel = 3;
Generalist.baseDexPerLevel = 3;
Generalist.baseAgiPerLevel = 3;
Generalist.baseStrPerLevel = 3;
Generalist.baseIntPerLevel = 3;
Generalist.classStats = {
    mpregen: (target) => target._mp.maximum * 0.005
};
exports.Generalist = Generalist;
