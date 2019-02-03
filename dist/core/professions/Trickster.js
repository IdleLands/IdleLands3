"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Trickster extends profession_1.Profession {
    static str(player) { return player.liveStats.luk / 10; }
    static con(player) { return player.liveStats.luk / 10; }
    static dex(player) { return player.liveStats.luk / 10; }
    static agi(player) { return player.liveStats.luk / 10; }
    static int(player) { return player.liveStats.luk / 10; }
    static setupSpecial(target) {
        target._special.name = 'Cards';
        target._special.maximum = 54;
        target._special.toMaximum();
    }
}
Trickster.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Trickster.baseMpPerLevel = profession_1.Profession.baseMpPerLevel;
Trickster.baseHpPerCon = 5;
Trickster.baseHpPerLuk = 10;
Trickster.baseMpPerLuk = 10;
Trickster.baseConPerLevel = 1;
Trickster.baseDexPerLevel = 1;
Trickster.baseAgiPerLevel = 1;
Trickster.baseStrPerLevel = 1;
Trickster.baseIntPerLevel = 1;
Trickster.baseLukPerLevel = 5;
exports.Trickster = Trickster;
