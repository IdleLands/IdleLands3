"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Contributor extends achievement_1.Achievement {
    static achievementData(player) {
        const isValid = _.get(player, `permanentAchievements.${this.permanentProp}`);
        if (!isValid)
            return [];
        const tier = 1;
        const rewards = [
            { type: 'title', title: 'Contributor', deathMessage: '%player found out that contributing to their death IRA was not such a good idea after all.' },
            { type: 'petattr', petattr: 'a gold coin that says thank you' }
        ];
        return [{
                tier,
                name: 'Contributor',
                desc: 'You contributed! Yay! Thanks!',
                type: achievement_1.AchievementTypes.SPECIAL,
                rewards
            }];
    }
}
Contributor.permanentProp = 'contributor';
exports.Contributor = Contributor;
