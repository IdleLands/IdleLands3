"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RestrictedNumber = require("restricted-number");
const profession_1 = require("../base/profession");
class Pirate extends profession_1.Profession {
    static setupSpecial(target) {
        target._special.name = 'Bottles';
        target._special.maximum = 99;
        target._special.toMaximum();
        target.$drunk = new RestrictedNumber(0, 100, 0);
    }
    static resetSpecial(target) {
        super.resetSpecial(target);
        delete target.$drunk;
    }
}
Pirate.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 180;
Pirate.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 30;
Pirate.baseHpPerCon = 18;
Pirate.baseHpPerStr = 6;
Pirate.baseMpPerInt = 30;
Pirate.baseConPerLevel = 3;
Pirate.baseDexPerLevel = 2;
Pirate.baseAgiPerLevel = 2;
Pirate.baseStrPerLevel = 3;
Pirate.baseIntPerLevel = 1;
Pirate.classStats = {
    str: (target, baseValue) => {
        const getsDrunkBonus = this.$ownerRef && this.$ownerRef.$personalities.isActive('Drunk')
            || this.$personalities && this.$personalities.isActive('Drunk');
        return getsDrunkBonus ? baseValue / 2 : 0;
    }
};
exports.Pirate = Pirate;
