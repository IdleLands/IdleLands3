"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Indecisive extends personality_1.Personality {
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Choice.Ignore') >= 10;
    }
}
Indecisive.disableOnActivate = ['Affirmer', 'Denier'];
Indecisive.description = 'All choices that would be ignored are automatically accepted or denied.';
exports.Indecisive = Indecisive;
