"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Personable extends achievement_1.Achievement {
    static achievementData(player) {
        const allPersonalities = player.$personalities._allPersonalities(player);
        return _.map(allPersonalities, pers => {
            return {
                tier: 1,
                name: `Personable: ${pers.name}`,
                desc: `Can now use personality ${pers.name}.`,
                type: achievement_1.AchievementTypes.PROGRESS,
                rewards: [{ type: 'personality', personality: pers.name }]
            };
        });
    }
}
exports.Personable = Personable;
