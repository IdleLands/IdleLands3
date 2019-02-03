"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Walker extends achievement_1.Achievement {
    static achievementData(player) {
        const playerSteps = player.$statistics.getStat('Character.Steps');
        let tier = 1;
        while (playerSteps >= Math.pow(10, tier)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [{
                type: 'stats',
                xp: tier
            }];
        if (tier >= 6) {
            rewards.push({ type: 'title', title: 'Tired Foot', deathMessage: '%player got sick of walking and gave up.' });
        }
        if (tier >= 7) {
            rewards.push({ type: 'petattr', petattr: 'a pair of sneakers that are a size too small' });
        }
        return [{
                tier,
                name: 'Walker',
                desc: `Gain +${tier} Bonus XP (added every time XP is gained) for taking ${(Math.pow(10, tier)).toLocaleString()} steps.`,
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards
            }];
    }
}
exports.Walker = Walker;
