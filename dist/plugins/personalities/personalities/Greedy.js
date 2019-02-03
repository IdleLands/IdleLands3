"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Greedy extends personality_1.Personality {
    static disable(player) {
        super.disable(player);
        this.flagDirty(player, ['xp', 'gold']);
    }
    static enable(player) {
        super.enable(player);
        this.flagDirty(player, ['xp', 'gold']);
    }
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Gold.Gain') >= 100000;
    }
}
Greedy.disableOnActivate = ['Seeker', 'Salvager'];
Greedy.description = 'Gain 15% more gold, but gain 15% less xp.';
Greedy.stats = {
    xp: (player, baseValue) => -baseValue * 0.15,
    gold: (player, baseValue) => baseValue * 0.15
};
exports.Greedy = Greedy;
