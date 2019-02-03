"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Critical extends achievement_1.Achievement {
    static achievementData(player) {
        const totalCrits = player.$statistics.getStat('Combat.Give.CriticalHit');
        let tier = 1;
        const baseValue = 25;
        while (totalCrits >= baseValue * Math.pow(2, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [{
                type: 'stats',
                dex: (player, baseValue) => baseValue * 0.01 * tier,
                dexDisplay: `+${tier}%`
            }];
        if (tier >= 6) {
            rewards.push({ type: 'title', title: 'Critical', deathMessage: '%player rolled a critical failure on their life-saving roll.' });
            rewards.push({ type: 'stats', crit: 1 });
        }
        if (tier >= 7) {
            rewards.push({ type: 'petattr', petattr: 'a giant bullseye with a few arrows in it' });
        }
        return [{
                tier,
                name: 'Critical',
                desc: `Gain ${tier}% DEX for having ${(baseValue * Math.pow(2, tier - 1)).toLocaleString()} critical hits.`,
                type: achievement_1.AchievementTypes.COMBAT,
                rewards
            }];
    }
}
exports.Critical = Critical;
