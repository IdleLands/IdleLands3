"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Druid extends profession_1.Profession {
    static setupSpecial(target) {
        target._special.name = 'Pets';
        target._special.set(0);
        target._special.maximum = Math.floor(target.level / 100) + 1;
    }
}
Druid.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 50;
Druid.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 50;
Druid.baseMpPerInt = 26;
Druid.baseConPerLevel = 8;
Druid.baseDexPerLevel = 2;
Druid.baseAgiPerLevel = 2;
Druid.baseStrPerLevel = 2;
Druid.baseIntPerLevel = 4;
Druid.classStats = {
    mpregen: (target) => target._mp.maximum * 0.01
};
exports.Druid = Druid;
