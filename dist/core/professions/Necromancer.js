"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Necromancer extends profession_1.Profession {
    static setupSpecial(target) {
        target._special.name = 'Minions';
        target._special.set(0);
        target._special.maximum = Math.floor(target.level / 25) + 1;
    }
}
Necromancer.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 180;
Necromancer.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 60;
Necromancer.baseMpPerInt = 72;
Necromancer.baseHpPerCon = 42;
Necromancer.baseConPerLevel = 1;
Necromancer.baseDexPerLevel = 3;
Necromancer.baseAgiPerLevel = -3;
Necromancer.baseStrPerLevel = 3;
Necromancer.baseIntPerLevel = 8;
Necromancer.baseLukPerLevel = -1;
Necromancer.classStats = {
    mpregen: (target) => target._mp.maximum * 0.02,
    agi: (target, baseValue) => -baseValue * 0.1,
    con: (target, baseValue) => -baseValue * 0.25,
    prone: 1,
    venom: 1,
    poison: 1,
    vampire: 1
};
exports.Necromancer = Necromancer;
