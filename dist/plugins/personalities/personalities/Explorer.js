"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Explorer extends personality_1.Personality {
    static disable(player) {
        super.disable(player);
        this.flagDirty(player, ['xp', 'str', 'con', 'agi', 'dex', 'int']);
    }
    static enable(player) {
        super.enable(player);
        this.flagDirty(player, ['xp', 'str', 'con', 'agi', 'dex', 'int']);
    }
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Steps') >= 100000;
    }
}
Explorer.description = 'You gain 50% more xp, but your stats are lowered by 25%.';
Explorer.stats = {
    xp: (player, baseValue) => baseValue * 0.5,
    str: (player, baseValue) => -baseValue * 0.25,
    con: (player, baseValue) => -baseValue * 0.25,
    dex: (player, baseValue) => -baseValue * 0.25,
    agi: (player, baseValue) => -baseValue * 0.25,
    int: (player, baseValue) => -baseValue * 0.25
};
exports.Explorer = Explorer;
