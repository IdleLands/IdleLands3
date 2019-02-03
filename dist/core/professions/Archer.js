"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Archer extends profession_1.Profession {
    static setupSpecial(target) {
        target._special.name = 'Focus';
        target._special.maximum = 100 * (Math.floor(target.level / 100) + 1);
        target._special.set(Math.round(target._special.maximum / 2));
    }
    static _eventSelfAttacked(target) {
        target._special.sub(5);
    }
    static _eventSelfTakeTurn(target) {
        target._special.add(10);
    }
}
Archer.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 90;
Archer.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 60;
Archer.baseHpPerCon = 18;
Archer.baseHpPerDex = 6;
Archer.baseMpPerDex = 18;
Archer.baseConPerLevel = 2;
Archer.baseDexPerLevel = 4;
Archer.baseAgiPerLevel = 3;
Archer.baseStrPerLevel = 2;
Archer.baseIntPerLevel = 1;
Archer.classStats = {
    dex: (target, baseValue) => baseValue * 0.25,
    shatter: 1,
    crit: 10
};
exports.Archer = Archer;
