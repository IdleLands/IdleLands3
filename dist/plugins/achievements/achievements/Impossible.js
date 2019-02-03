"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Impossible extends achievement_1.Achievement {
    static achievementData(player) {
        const requiredCollectible = player.$collectibles.hasCollectible('How Did You Even Get Out Here') || player.$collectibles.hadCollectible('How Did You Even Get Out Here');
        if (!requiredCollectible)
            return [];
        return [{
                tier: 1,
                name: 'Impossible',
                desc: 'Cheater!',
                type: achievement_1.AchievementTypes.SPECIAL,
                rewards: [{
                        type: 'title', title: 'l33t h4x0r', deathMessage: '%player cheated in life, and will probably cheat in death.'
                    }, {
                        type: 'petattr', petattr: 'a big cheater'
                    }]
            }];
    }
}
exports.Impossible = Impossible;
