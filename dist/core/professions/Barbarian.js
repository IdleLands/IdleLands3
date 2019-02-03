"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Barbarian extends profession_1.Profession {
    static setupSpecial(target) {
        target._special.name = 'Rage';
        target._special.set(0);
        target._special.maximum = 100;
        target.recalculateStats(['str']);
    }
    static resetSpecial(target) {
        super.resetSpecial(target);
        if (target.$dirty) {
            target.$dirty.flags.str = true;
        }
    }
    static _eventSelfAttacked(target) {
        target._special.add(5);
    }
    static _eventSelfAttack(target) {
        target._special.sub(2);
    }
    static _eventAllyKilled(target) {
        target._special.add(10);
    }
    static _eventSelfKilled(target) {
        target._special.toMinimum();
    }
    static _eventSelfKill(target) {
        target._special.sub(15);
    }
}
Barbarian.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 210;
Barbarian.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 6;
Barbarian.baseHpPerStr = 18;
Barbarian.baseHpPerCon = 12;
Barbarian.baseConPerLevel = 6;
Barbarian.baseDexPerLevel = 1;
Barbarian.baseAgiPerLevel = 1;
Barbarian.baseStrPerLevel = 6;
Barbarian.baseIntPerLevel = -5;
Barbarian.classStats = {
    hpregen: (target) => target._hp.maximum * 0.01,
    damageReduction: (target) => target.level * 10,
    dex: (target, baseValue) => -baseValue * 0.5,
    agi: (target, baseValue) => -baseValue * 0.5,
    str: (target, baseValue) => baseValue * target.special / 100
};
exports.Barbarian = Barbarian;
