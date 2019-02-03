"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Sponge extends achievement_1.Achievement {
    static achievementData(player) {
        const value = player.$statistics.getStat('Combat.Receive.Damage');
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
                hp: (player, baseValue) => baseValue * 0.01 * tier,
                hpDisplay: `+${tier}%`,
                con: 20 * tier
            }];
        if (tier >= 4) {
            rewards.push({ type: 'title', title: 'Sponge', deathMessage: '%player could only absorb so much.' });
        }
        if (tier >= 5) {
            rewards.push({ type: 'petattr', petattr: 'a sponge' });
        }
        return [{
                tier,
                name: 'Sponge',
                desc: `Gain +${tier}% HP and +${(tier * 20).toLocaleString()} CON for taking ${(baseValue * Math.pow(10, tier - 1)).toLocaleString()} damage.`,
                type: achievement_1.AchievementTypes.COMBAT,
                rewards
            }];
    }
}
exports.Sponge = Sponge;
