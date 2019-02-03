"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Salvager extends personality_1.Personality {
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Item.Salvage') >= 100;
    }
}
Salvager.disableOnActivate = ['TreasureHunter', 'Greedy'];
Salvager.description = 'You salvage instead of sell. Cuts gold gain by 95%. Only effective for guild members.';
Salvager.stats = {
    gold: (player, baseValue) => -baseValue * 0.95
};
exports.Salvager = Salvager;
