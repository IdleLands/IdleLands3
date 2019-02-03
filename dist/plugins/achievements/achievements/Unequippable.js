"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Unequippable extends achievement_1.Achievement {
    static achievementData(player) {
        const totalUnequippable = player.$statistics.getStat('Character.Item.Unequippable');
        if (totalUnequippable < 100000)
            return [];
        const baseReward = {
            tier: 1,
            name: 'Unequippable',
            desc: `Gain a special title for ${(100000).toLocaleString()} unable-to-equip items.`,
            type: achievement_1.AchievementTypes.PROGRESS,
            rewards: [{
                    type: 'title',
                    title: 'Unequippable',
                    deathMessage: '%player\'s corpse wasn\'t equippable.'
                }, {
                    type: 'petattr',
                    petattr: 'an unequippable item'
                }]
        };
        return [baseReward];
    }
}
exports.Unequippable = Unequippable;
