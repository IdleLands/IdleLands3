"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Bitomancer extends profession_1.Profession {
    static setupSpecial(target) {
        target._special.name = 'Bandwidth';
        target._special.maximum = Math.floor(56 * Math.pow(target.level, 2) / 50);
        target._special.toMaximum();
    }
}
Bitomancer.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 60;
Bitomancer.baseConPerLevel = 1;
Bitomancer.baseDexPerLevel = 3;
Bitomancer.baseAgiPerLevel = 1;
Bitomancer.baseStrPerLevel = 1;
Bitomancer.baseIntPerLevel = 7;
exports.Bitomancer = Bitomancer;
