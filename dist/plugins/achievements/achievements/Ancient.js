"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Ancient extends achievement_1.Achievement {
    static achievementData(player) {
        const isValid = _.get(player, `permanentAchievements.${this.permanentProp}`);
        if (!isValid)
            return [];
        const tier = 1;
        const rewards = [{
                type: 'stats',
                str: (player, baseValue) => baseValue * 0.01 * tier,
                con: (player, baseValue) => baseValue * 0.01 * tier,
                dex: (player, baseValue) => baseValue * 0.01 * tier,
                luk: (player, baseValue) => baseValue * 0.01 * tier,
                int: (player, baseValue) => baseValue * 0.01 * tier,
                agi: (player, baseValue) => baseValue * 0.01 * tier,
                strDisplay: `+${tier}%`,
                conDisplay: `+${tier}%`,
                dexDisplay: `+${tier}%`,
                lukDisplay: `+${tier}%`,
                intDisplay: `+${tier}%`,
                agiDisplay: `+${tier}%`
            }];
        rewards.push({ type: 'title', title: 'Ancient', deathMessage: '%player withered away and crumbled to dust.' });
        rewards.push({ type: 'petattr', petattr: 'an old rock' });
        return [{
                tier,
                name: 'Ancient',
                desc: 'Gain +1% STR/CON/DEX/AGI/INT/LUK for playing the original IdleLands.',
                type: achievement_1.AchievementTypes.SPECIAL,
                rewards
            }];
    }
}
Ancient.permanentProp = 'ancient';
exports.Ancient = Ancient;
