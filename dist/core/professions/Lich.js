"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const profession_1 = require("../base/profession");
class Lich extends profession_1.Profession {
    static setupSpecial(target) {
        const numProfessions = Math.floor(target.level / 100) + 1;
        let secondaries = ['Bard', 'Cleric', 'Fighter', 'Generalist', 'Mage', 'SandwichArtist'];
        if (target.$statistics) {
            const allProfsBeen = _.keys(target.$statistics.getStat('Character.Professions'));
            secondaries = _.filter(secondary => _.includes(allProfsBeen, secondary));
        }
        target.$secondaryProfessions = _.sampleSize(secondaries, numProfessions);
        target._special.name = 'Phylactic Energy';
        target._special.maximum = Math.floor(target.level / 25) + 1;
        target._special.toMaximum();
    }
    static resetSpecial(target) {
        super.resetSpecial(target);
        delete target.$secondaryProfessions;
    }
    static _eventSelfKilled(target) {
        if (target._special.atMinimum())
            return;
        target.$effects.clear();
        target.$battle._emitMessage(`${target.fullname} sprang back to life via the magic of Phylactery!`);
        target._special.sub(1);
        target._hp.toMaximum();
    }
}
Lich.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Lich.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 150;
Lich.baseMpPerInt = 75;
Lich.baseConPerLevel = 5;
Lich.baseDexPerLevel = 0;
Lich.baseAgiPerLevel = 0;
Lich.baseStrPerLevel = 7;
Lich.baseIntPerLevel = 7;
Lich.classStats = {
    mpregen: (target) => target._mp.maximum * 0.02
};
exports.Lich = Lich;
