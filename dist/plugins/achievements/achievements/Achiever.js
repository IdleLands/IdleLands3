"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Achiever extends achievement_1.Achievement {
    static achievementData(player) {
        const value = player.$achievements.tiers();
        const baseValue = 30;
        let tier = 1;
        while (value >= baseValue * tier) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [];
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Achiever', deathMessage: '%player finally achieved something worthwhile: dying.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a golden plaque' });
        }
        return [{
                tier,
                name: 'Achiever',
                desc: `Gain +${tier} achievement${tier > 1 ? 's' : ''}.`,
                type: achievement_1.AchievementTypes.EVENT,
                rewards
            }];
    }
}
exports.Achiever = Achiever;
