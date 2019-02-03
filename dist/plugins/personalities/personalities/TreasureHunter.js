"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class TreasureHunter extends personality_1.Personality {
    static disable(player) {
        super.disable(player);
        this.flagDirty(player, ['xp', 'gold', 'itemFindRange']);
    }
    static enable(player) {
        super.enable(player);
        this.flagDirty(player, ['xp', 'gold', 'itemFindRange']);
    }
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Item.Sell') >= 100;
    }
}
TreasureHunter.disableOnActivate = ['Salvager'];
TreasureHunter.description = 'Find better items based on level, but gain 84% less gold and xp.';
TreasureHunter.stats = {
    xp: (player, baseValue) => -baseValue * 0.84,
    gold: (player, baseValue) => -baseValue * 0.84,
    itemFindRangeMultiplier: (player) => player.level * 0.03
};
exports.TreasureHunter = TreasureHunter;
