"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profession_1 = require("../base/profession");
class Beatomancer extends profession_1.Profession {
}
Beatomancer.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Beatomancer.baseConPerLevel = 1;
Beatomancer.baseDexPerLevel = 4;
Beatomancer.baseAgiPerLevel = 4;
Beatomancer.baseStrPerLevel = 1;
Beatomancer.baseIntPerLevel = 1;
Beatomancer.baseLukPerLevel = 2;
exports.Beatomancer = Beatomancer;
