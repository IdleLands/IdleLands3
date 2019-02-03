"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Jester extends profession_1.Profession {
    static str(player) { return player.liveStats.luk / 5; }
    static con(player) { return player.liveStats.luk / 5; }
    static dex(player) { return player.liveStats.luk / 5; }
    static agi(player) { return player.liveStats.luk / 5; }
    static int(player) { return player.liveStats.luk / 5; }
}
Jester.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Jester.baseMpPerLevel = profession_1.Profession.baseMpPerLevel;
Jester.baseHpPerCon = 0;
Jester.baseHpPerLuk = 30;
Jester.baseMpPerLuk = 30;
Jester.baseConPerLevel = 0;
Jester.baseDexPerLevel = 0;
Jester.baseAgiPerLevel = 0;
Jester.baseStrPerLevel = 0;
Jester.baseIntPerLevel = 0;
Jester.baseLukPerLevel = 10;
exports.Jester = Jester;
