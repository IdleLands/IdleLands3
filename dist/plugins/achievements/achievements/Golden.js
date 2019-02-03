"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Golden extends achievement_1.Achievement {
    static achievementData(player) {
        const value = player.$statistics.getStat('Character.Gold.Gain') + player.$statistics.getStat('Character.Gold.Lose');
        const baseValue = 20000;
        let tier = 1;
        while (value >= baseValue * Math.pow(10, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [{
                type: 'stats',
                itemValueMultiplier: (tier * 0.05).toFixed(2),
                agi: (player, baseValue) => baseValue * 0.01 * tier,
                agiDisplay: `+${tier}%`
            }];
        if (tier >= 4) {
            rewards.push({ type: 'title', title: 'Golden Child', deathMessage: '%player was transmuted into a literal brick of gold and sold on the gold market. Talk about going gold.' });
        }
        if (tier >= 5) {
            rewards.push({ type: 'petattr', petattr: 'a chunk of metal that is painted gold' });
        }
        return [{
                tier,
                name: 'Golden',
                desc: `Sell items for ${(tier * 5).toLocaleString()}% more for gaining and losing at least ${(baseValue * Math.pow(10, tier - 1)).toLocaleString()} gold, and +${tier}% AGI.`,
                type: achievement_1.AchievementTypes.EVENT,
                rewards
            }];
    }
}
exports.Golden = Golden;
