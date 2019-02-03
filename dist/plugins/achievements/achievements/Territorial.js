"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Territorial extends achievement_1.Achievement {
    static achievementData(player) {
        const totalRegions = _.size(player.$statistics.getStat('Character.Regions'));
        let tier = 1;
        while (totalRegions >= tier * 10) {
            tier++;
        }
        tier--;
        if (tier === 0)
            return [];
        const rewards = [{
                type: 'stats',
                str: (player, baseValue) => baseValue * 0.01 * tier,
                strDisplay: `+${tier}%`
            }];
        if (tier >= 10) {
            rewards.push({ type: 'title', title: 'Territorial', deathMessage: '%player tried guarding %hisher territory but got served by a rival gang.' });
        }
        if (tier >= 11) {
            rewards.push({ type: 'petattr', petattr: 'a dog to help guard your territory' });
        }
        return [{
                tier,
                name: 'Territorial',
                desc: `Gain +${tier}% STR for every ${(tier * 10).toLocaleString()} unique regions explored.`,
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards
            }];
    }
}
exports.Territorial = Territorial;
