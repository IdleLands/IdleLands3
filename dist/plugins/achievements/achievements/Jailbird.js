"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Jailbird extends achievement_1.Achievement {
    static achievementData(player) {
        const requiredCollectible = player.$collectibles.hasCollectible('Jail Brick') || player.$collectibles.hadCollectible('Jail Brick');
        if (!requiredCollectible)
            return [];
        return [{
                tier: 1,
                name: 'Jailbird',
                desc: 'You got the jail brick. Enjoy an incredibly rare title!',
                type: achievement_1.AchievementTypes.SPECIAL,
                rewards: [{
                        type: 'title', title: 'Jailbird', deathMessage: '%player went to the jail where people die and died.'
                    }, {
                        type: 'petattr', petattr: 'a jail brick'
                    }]
            }];
    }
}
exports.Jailbird = Jailbird;
