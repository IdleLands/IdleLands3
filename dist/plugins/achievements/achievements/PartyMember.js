"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class PartyMember extends achievement_1.Achievement {
    static achievementData(player) {
        const totalPartySteps = player.$statistics.getStat('Character.Movement.Party');
        if (totalPartySteps < 100000)
            return [];
        const baseReward = {
            tier: 1,
            name: 'Party Member',
            desc: `Gain a special title (and +5% max item score) for being in a party for ${(100000).toLocaleString()} steps.`,
            type: achievement_1.AchievementTypes.EXPLORE,
            rewards: [{
                    type: 'title',
                    title: 'Party Member',
                    deathMessage: '%player died through the power of TEAM SYNERGY!'
                }, {
                    type: 'petattr',
                    petattr: 'a paper people chain'
                }, {
                    type: 'stats',
                    itemFindRangeMultiplier: 0.05
                }]
        };
        if (totalPartySteps >= 1000000) {
            baseReward.rewards.push({
                type: 'title',
                title: 'Pack Wolf',
                deathMessage: '%player got eaten by a pack of wolves.'
            });
        }
        return [baseReward];
    }
}
exports.PartyMember = PartyMember;
