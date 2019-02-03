"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Bloodthirsty extends personality_1.Personality {
    static disable(player) {
        super.disable(player);
        this.flagDirty(player, ['BattleChance', 'BattlePvPChance', 'GoldForsakeChance', 'XPForsakeChance', 'ItemForsakeChance']);
    }
    static enable(player) {
        super.enable(player);
        this.flagDirty(player, ['BattleChance', 'BattlePvPChance', 'GoldForsakeChance', 'XPForsakeChance', 'ItemForsakeChance']);
    }
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Event.Battle') >= 50
            && player.$statistics.getStat('Character.Event.BattlePvP') >= 50
            && player.$statistics.getStat('Combat.Win') >= 50;
    }
}
Bloodthirsty.disableOnActivate = ['Coward'];
Bloodthirsty.description = 'Be more likely to go into combat, but be more reckless.';
Bloodthirsty.stats = {
    BattleChance: (player, baseValue) => baseValue * 2,
    BattlePvPChance: (player, baseValue) => baseValue * 2,
    GoldForsakeChance: (player, baseValue) => baseValue,
    XPForsakeChance: (player, baseValue) => baseValue,
    ItemForsakeChance: (player, baseValue) => baseValue
};
exports.Bloodthirsty = Bloodthirsty;
