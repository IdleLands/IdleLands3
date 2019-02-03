"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Mage extends profession_1.Profession {
}
Mage.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 150;
Mage.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 150;
Mage.baseMpPerInt = 42;
Mage.baseConPerLevel = 2;
Mage.baseDexPerLevel = 2;
Mage.baseAgiPerLevel = 2;
Mage.baseStrPerLevel = 2;
Mage.baseIntPerLevel = 6;
Mage.classStats = {
    mpregen: (target) => target._mp.maximum * 0.01
};
exports.Mage = Mage;
