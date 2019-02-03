"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class SandwichArtist extends profession_1.Profession {
}
SandwichArtist.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 90;
SandwichArtist.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 30;
SandwichArtist.baseMpPerInt = 12;
SandwichArtist.baseConPerLevel = 1;
SandwichArtist.baseDexPerLevel = 5;
SandwichArtist.baseAgiPerLevel = 1;
SandwichArtist.baseStrPerLevel = 3;
SandwichArtist.baseIntPerLevel = 1;
SandwichArtist.classStats = {
    mpregen: (target) => target._mp.maximum * 0.025
};
exports.SandwichArtist = SandwichArtist;
