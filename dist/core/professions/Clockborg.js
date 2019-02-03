"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Clockborg extends profession_1.Profession {
    static setupSpecial(target) {
        target._special.name = 'Turrets';
        target._special.set(0);
        target._special.maximum = 3;
    }
}
Clockborg.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 400;
Clockborg.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 10;
Clockborg.baseHpPerCon = 27;
Clockborg.baseMpPerInt = 27;
Clockborg.baseConPerLevel = 1;
Clockborg.baseDexPerLevel = 1;
Clockborg.baseAgiPerLevel = 1;
Clockborg.baseStrPerLevel = 6;
Clockborg.baseIntPerLevel = 6;
exports.Clockborg = Clockborg;
