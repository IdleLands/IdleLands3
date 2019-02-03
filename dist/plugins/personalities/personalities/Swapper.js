"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personality_1 = require("../personality");
class Swapper extends personality_1.Personality {
    static disable(player) {
        super.disable(player);
        this.flagDirty(player, ['EnchantChance', 'ItemBlessChance', 'FindItemChance', 'SwitcherooChance']);
    }
    static enable(player) {
        super.enable(player);
        this.flagDirty(player, ['EnchantChance', 'ItemBlessChance', 'FindItemChance', 'SwitcherooChance']);
    }
    static hasEarned(player) {
        return player.$statistics.getStat('Character.Event.Switcheroo') >= 5
            && player.$statistics.getStat('Character.Event.ItemBless') >= 100
            && player.$statistics.getStat('Character.Event.FindItem') >= 1000
            && player.$achievements.hasAchievement('Enchanted');
    }
}
Swapper.description = 'More positive item effects, but more switcheroos.';
Swapper.stats = {
    EnchantChance: (player, baseValue) => baseValue,
    ItemBlessChance: (player, baseValue) => baseValue,
    FindItemChance: (player, baseValue) => baseValue,
    SwitcherooChance: (player, baseValue) => baseValue * 6
};
exports.Swapper = Swapper;
