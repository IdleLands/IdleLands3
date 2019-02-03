"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Herder extends achievement_1.Achievement {
    static achievementData(player) {
        const allPets = player.$pets.earnedPets;
        return _.map(allPets, ({ name }) => {
            return {
                tier: 1,
                name: `Herder: ${name}`,
                desc: `Can now buy pet ${name}.`,
                type: achievement_1.AchievementTypes.PET,
                rewards: [{ type: 'pet', pet: name }]
            };
        });
    }
}
exports.Herder = Herder;
