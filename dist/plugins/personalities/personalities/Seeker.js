"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Seeker extends personality_1.Personality {
    static disable(player) {
        super.disable(player);
        this.flagDirty(player, ['xp', 'gold']);
    }
    static enable(player) {
        super.enable(player);
        this.flagDirty(player, ['xp', 'gold']);
    }
    static hasEarned(player) {
        return player.$statistics.getStat('Character.XP.Gain') >= 100000;
    }
}
Seeker.disableOnActivate = ['Greedy'];
Seeker.description = 'Gain 15% more xp, but gain 15% less gold.';
Seeker.stats = {
    xp: (player, baseValue) => baseValue * 0.15,
    gold: (player, baseValue) => -baseValue * 0.15
};
exports.Seeker = Seeker;
