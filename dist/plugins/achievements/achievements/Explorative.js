"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Explorative extends achievement_1.Achievement {
    static achievementData(player) {
        const totalMaps = _.size(player.$statistics.getStat('Character.Maps'));
        let tier = 1;
        while (totalMaps >= tier * 5) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [{
                type: 'stats',
                int: (player, baseValue) => baseValue * 0.01 * tier,
                intDisplay: `+${tier}%`
            }];
        if (tier >= 4) {
            rewards.push({ type: 'stats', itemFindRange: 100 });
        }
        if (tier >= 5) {
            rewards.push({ type: 'title', title: 'Explorative', deathMessage: '%player wanted to explore the underworld.' });
        }
        if (tier >= 6) {
            rewards.push({ type: 'petattr', petattr: 'a map that only works when held upside down' });
        }
        return [{
                tier,
                name: 'Explorative',
                desc: `Gain +${tier}% INT for exploring ${(tier * 5).toLocaleString()} unique maps.`,
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards
            }];
    }
}
exports.Explorative = Explorative;
