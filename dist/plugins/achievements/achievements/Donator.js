"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const achievement_1 = require("../achievement");
class Donator extends achievement_1.Achievement {
    static achievementData(player) {
        const isValid = _.get(player, `permanentAchievements.${this.permanentProp}`);
        if (!isValid)
            return [];
        const tier = 1;
        const rewards = [
            { type: 'title', title: 'Donator', deathMessage: '%player donated to the best cause of all: their inevitable demise.' },
            { type: 'petattr', petattr: 'a platinum bar that says thank you so much, literally' }
        ];
        return [{
                tier,
                name: 'Donator',
                desc: 'You donated (via PayPal)! Yay! Thanks for being an early supporter!',
                type: achievement_1.AchievementTypes.SPECIAL,
                rewards
            }];
    }
}
Donator.permanentProp = 'paypalDonator';
exports.Donator = Donator;
