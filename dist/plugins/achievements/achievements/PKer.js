"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class PKer extends achievement_1.Achievement {
    static achievementData(player) {
        const value = player.$statistics.getStat('Combat.Kills.Player');
        const baseValue = 10;
        let tier = 1;
        while (value >= baseValue * Math.pow(10, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [{
                type: 'stats',
                str: 5 * tier,
                con: 5 * tier,
                dex: 5 * tier,
                int: 5 * tier,
                agi: 5 * tier,
                itemFindRangeMultiplier: (tier * 0.1).toFixed(1)
            }];
        if (tier >= 4) {
            rewards.push({ type: 'stats', itemFindRange: 100 });
        }
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'PKer', deathMessage: '%player killed too many friends that this was probably a long time coming.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a talking sword that only says mean things to you' });
        }
        return [{
                tier,
                name: 'PKer',
                desc: `Gain +${(tier * 5).toLocaleString()} STR/CON/DEX/INT/AGI and +${(tier * 10).toLocaleString()}% better item find for killing ${(baseValue * Math.pow(10, tier - 1)).toLocaleString()} players.`,
                type: achievement_1.AchievementTypes.COMBAT,
                rewards
            }];
    }
}
exports.PKer = PKer;
