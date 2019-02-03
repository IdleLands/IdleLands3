"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Denier extends personality_1.Personality {
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Choice.Choose.No') >= 10;
    }
}
Denier.disableOnActivate = ['Affirmer', 'Indecisive'];
Denier.description = 'All choices that would be ignored are automatically denied.';
exports.Denier = Denier;
