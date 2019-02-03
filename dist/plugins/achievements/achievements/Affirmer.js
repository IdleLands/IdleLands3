"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Affirmer extends achievement_1.Achievement {
    static achievementData(player) {
        const totalAffirms = player.$statistics.getStat('Character.Choice.Affirm');
        if (totalAffirms < 5000)
            return [];
        const baseReward = {
            tier: 1,
            name: 'Affirmer',
            desc: `Gain a special title (and +5% max item score) for auto-accepting ${(5000).toLocaleString()} choices.`,
            type: achievement_1.AchievementTypes.EVENT,
            rewards: [{
                    type: 'title',
                    title: 'Affirmer',
                    deathMessage: '%player said yes to death.'
                }, {
                    type: 'petattr',
                    petattr: 'a personal yes-man'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        return [baseReward];
    }
}
exports.Affirmer = Affirmer;
