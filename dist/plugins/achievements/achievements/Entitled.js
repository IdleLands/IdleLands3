"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Entitled extends achievement_1.Achievement {
    static achievementData(player) {
        const value = player.$achievements.titles().length;
        const baseValue = 15;
        if (value < baseValue)
            return [];
        return [{
                tier: 1,
                name: 'Entitled',
                desc: 'Gain a title for getting 15 titles.',
                type: achievement_1.AchievementTypes.EVENT,
                rewards: [{
                        type: 'title',
                        title: 'Entitled',
                        deathMessage: '%player didn\'t want to live anyway, b-b-baka!'
                    }, {
                        type: 'petattr',
                        petattr: 'a small child who wants a lot of things'
                    }]
            }];
    }
}
exports.Entitled = Entitled;
