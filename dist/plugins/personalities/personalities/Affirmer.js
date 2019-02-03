"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Affirmer extends personality_1.Personality {
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Choice.Choose.Yes') >= 10;
    }
}
Affirmer.disableOnActivate = ['Denier', 'Indecisive'];
Affirmer.description = 'All choices that would be ignored are automatically accepted.';
exports.Affirmer = Affirmer;
