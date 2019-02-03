"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Gambler extends achievement_1.Achievement {
    static achievementData(player) {
        const value = player.$statistics.getStat('Character.Gold.Gamble.Win') + player.$statistics.getStat('Character.Gold.Gamble.Lose');
        const baseValue = 100000;
        const wins = player.$statistics.getStat('Character.Gamble.WinTimes');
        const loses = player.$statistics.getStat('Character.Gamble.LoseTimes');
        const winsDD = player.$statistics.getStat('Character.Gamble.WinTimesDoubleDown');
        const losesDD = player.$statistics.getStat('Character.Gamble.LoseTimesDoubleDown');
        if (wins < 10 || loses < 30 || winsDD < 3 || losesDD < 10)
            return [];
        let tier = 1;
        while (value >= baseValue * Math.pow(10, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [{
                type: 'stats',
                gold: (player, baseValue) => baseValue * 0.05 * tier,
                goldDisplay: `+${tier * 5}%`
            }];
        if (tier >= 3) {
            rewards.push({ type: 'title', title: 'Gambler', deathMessage: '%player gambled away %hisher life.' });
        }
        if (tier >= 4) {
            rewards.push({ type: 'petattr', petattr: 'a double-headed coin' });
        }
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Irresponsible' });
        }
        return [{
                tier,
                name: 'Gambler',
                desc: `Gain ${(tier * 5).toLocaleString()}% more gold for gambling at least ${(baseValue * Math.pow(10, tier - 1)).toLocaleString()} gold.`,
                type: achievement_1.AchievementTypes.EVENT,
                rewards
            }];
    }
}
exports.Gambler = Gambler;
