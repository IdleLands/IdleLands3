"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Bossy extends achievement_1.Achievement {
    static achievementData(player) {
        const value = player.$statistics.countChild('Character.BossKills');
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
                str: tier * 10,
                con: tier * 10
            }];
        if (tier >= 4) {
            rewards.push({ type: 'stats', itemFindRange: 100 });
        }
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Bossy', deathMessage: '%player ordered around the wrong person and the mutiny resulted in %hisher death!' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a goblin head on a spear' });
        }
        if (tier >= 15) {
            rewards.push({ type: 'gender', gender: `green boss monster` });
        }
        if (tier >= 30) {
            rewards.push({ type: 'gender', gender: `blue boss monster` });
        }
        return [{
                tier,
                name: 'Bossy',
                desc: `Gain +${(tier * 10).toLocaleString()} STR/CON for killing ${baseValue * tier} bosses.`,
                type: achievement_1.AchievementTypes.COMBAT,
                rewards
            }];
    }
}
exports.Bossy = Bossy;
