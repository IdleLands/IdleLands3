"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Eventful extends achievement_1.Achievement {
    static achievementData(player) {
        const totalEvents = player.$statistics.getStat('Character.Events');
        const baseValue = 100;
        let tier = 1;
        while (totalEvents >= baseValue * Math.pow(10, tier - 1)) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [{
                type: 'stats',
                itemFindRangeMultiplier: (tier * 0.1).toFixed(1)
            }];
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Center of Attention', deathMessage: '%player exploded into a fantastic display of lights, disco, and confetti.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a megaphone' });
        }
        return [{
                tier,
                name: 'Eventful',
                desc: `Equip items that are ${(10 * tier).toLocaleString()}% better for experiencing ${(baseValue * Math.pow(10, tier - 1)).toLocaleString()} events.`,
                type: achievement_1.AchievementTypes.EVENT,
                rewards
            }];
    }
}
exports.Eventful = Eventful;
