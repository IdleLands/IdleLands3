"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Scrappy extends achievement_1.Achievement {
    static achievementData(player) {
        const totalSalvages = player.$statistics.getStat('Character.Item.Salvage');
        if (totalSalvages < 100000)
            return [];
        const baseReward = {
            tier: 1,
            name: 'Scrappy',
            desc: `Gain a special title for ${(100000).toLocaleString()} item salvages.`,
            type: achievement_1.AchievementTypes.PROGRESS,
            rewards: [{
                    type: 'title',
                    title: 'Scrappy',
                    deathMessage: '%player got scrapped.'
                }, {
                    type: 'petattr',
                    petattr: 'a scrap of metal'
                }]
        };
        return [baseReward];
    }
}
exports.Scrappy = Scrappy;
