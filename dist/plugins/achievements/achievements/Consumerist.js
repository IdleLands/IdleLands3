"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Consumerist extends achievement_1.Achievement {
    static achievementData(player) {
        const value = player.$statistics.getStat('Character.Gold.Spent');
        const baseValue = 1000;
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
                dex: (player, baseValue) => baseValue * 0.01 * tier,
                dexDisplay: `+${tier}%`
            }];
        if (tier >= 4) {
            rewards.push({ type: 'title', title: 'Consumerist', deathMessage: '%player consumed too much and died of an implosive explosion.' });
        }
        if (tier >= 5) {
            rewards.push({ type: 'petattr', petattr: 'a bronze coin that looks like it got chewed on' });
        }
        return [{
                tier,
                name: 'Consumerist',
                desc: `Sell items for ${(tier * 5).toLocaleString()}% more for spending ${(baseValue * Math.pow(10, tier - 1)).toLocaleString()} gold, and gain +${tier}% DEX.`,
                type: achievement_1.AchievementTypes.EVENT,
                rewards
            }];
    }
}
exports.Consumerist = Consumerist;
