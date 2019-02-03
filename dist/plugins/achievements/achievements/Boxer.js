"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Boxer extends achievement_1.Achievement {
    static achievementData(player) {
        const value = player.$statistics.countChild('Character.Treasure');
        const baseValue = 15;
        let tier = 1;
        while (value >= baseValue * tier) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [{
                type: 'stats',
                dex: tier * 10,
                agi: tier * 10
            }];
        if (tier >= 4) {
            rewards.push({ type: 'stats', itemFindRange: 100 });
        }
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Boxer', deathMessage: '%player went home for boxing day.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a mini treasure chest containing an even smaller treasure chest' });
        }
        return [{
                tier,
                name: 'Boxer',
                desc: `+${(tier * 10).toLocaleString()} DEX/AGI for opening ${baseValue * tier} chests.`,
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards
            }];
    }
}
exports.Boxer = Boxer;
