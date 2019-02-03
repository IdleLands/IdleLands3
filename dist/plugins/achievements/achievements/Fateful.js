"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Fateful extends achievement_1.Achievement {
    static achievementData(player) {
        const totalFates = player.$statistics.getStat('Character.Event.Providence');
        if (totalFates < 500)
            return [];
        return [{
                tier: 1,
                name: 'Fateful',
                desc: 'Gain a special title (and +5% max item score) for 500 fate pool uses.',
                type: achievement_1.AchievementTypes.EXPLORE,
                rewards: [{
                        type: 'title',
                        title: 'Fateful',
                        deathMessage: '%player tempted the scales of fate and was nerfed.'
                    }, {
                        type: 'petattr',
                        petattr: 'a miniature pool with a question mark in it'
                    }, {
                        type: 'stats',
                        itemFindRangeMultiplier: 0.05
                    }]
            }];
    }
}
exports.Fateful = Fateful;
