"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class SoleFoot extends achievement_1.Achievement {
    static achievementData(player) {
        const soloSteps = player.$statistics.getStat('Character.Movement.Solo');
        if (soloSteps < 100000)
            return [];
        const baseReward = {
            tier: 1,
            name: 'Sole Foot',
            desc: `Gain a special title (and +5% max item score) for taking ${(100000).toLocaleString()} solo steps.`,
            type: achievement_1.AchievementTypes.EXPLORE,
            rewards: [{
                    type: 'title',
                    title: 'Sole Foot',
                    deathMessage: '%player was walking on one foot for too long that %she fell over and died.'
                }, {
                    type: 'petattr',
                    petattr: 'a literal rabbit foot'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        if (soloSteps >= 1000000) {
            baseReward.rewards.push({
                type: 'title',
                title: 'Lone Wolf',
                deathMessage: '%player was alone for too long in the prairie and got eaten by a wolf.'
            });
        }
        return [baseReward];
    }
}
exports.SoleFoot = SoleFoot;
