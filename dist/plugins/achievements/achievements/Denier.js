"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Denier extends achievement_1.Achievement {
    static achievementData(player) {
        const totalDenies = player.$statistics.getStat('Character.Choice.Deny');
        if (totalDenies < 5000)
            return [];
        const baseReward = {
            tier: 1,
            name: 'Denier',
            desc: `Gain a special title (and +5% max item score) for auto-denying ${(5000).toLocaleString()} choices.`,
            type: achievement_1.AchievementTypes.EVENT,
            rewards: [{
                    type: 'title',
                    title: 'Denier',
                    deathMessage: '%player said no to death, but died anyway.'
                }, {
                    type: 'petattr',
                    petattr: 'a personal no-sir'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        return [baseReward];
    }
}
exports.Denier = Denier;
